package com.dhyan.webauthTest.WebAuthn;

import com.dhyan.webauthTest.Authenticator.Authenticator;
import com.dhyan.webauthTest.DTO.DeviceDTO;
import com.dhyan.webauthTest.DTO.WebauthLoginResponse;
import com.dhyan.webauthTest.Security.WebAuthnAuthenticationToken;
import com.dhyan.webauthTest.UserData.AppUser;
import com.dhyan.webauthTest.Users.Users;
import com.dhyan.webauthTest.Users.UsersRepository;
import com.dhyan.webauthTest.Utility.Utility;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.yubico.webauthn.*;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.exception.AssertionFailedException;
import com.yubico.webauthn.exception.RegistrationFailedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Controller
public class AuthController {

    private final RelyingParty relyingParty;
    private final RegistrationService service;
    private Map<String, PublicKeyCredentialCreationOptions> requestOptionMap = new HashMap<>();
    private Map<String, AssertionRequest> assertionRequestMap = new HashMap<>();

    AuthController(RegistrationService service, RelyingParty relyingPary) {
        this.relyingParty = relyingPary;
        this.service = service;
    }

    @Autowired
    UsersRepository usersRepository;

    private Map<String, AppUser> registrationSessions = new HashMap<>();

    @PostMapping("/register")
    @ResponseBody
    public String newUserRegistration(
            @RequestParam String username
    ) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        AppUser appUser = service.getUserRepo().findByUserName(username);
        if (appUser == null) {
            UserIdentity userIdentity = UserIdentity.builder()
                    .name(username)
                    .displayName(username)
                    .id(Utility.generateRandom(32))
                    .build();
            AppUser saveUser = new AppUser(userIdentity);
            saveUser.setUsers(user);
            registrationSessions.put(username, saveUser);
        } else {
            registrationSessions.put(username, appUser);
        }
        return newAuthRegistration(username);
    }

    @PostMapping("/register-auth")
    @ResponseBody
    public String newAuthRegistration(
            @RequestParam String username
    ) {
        AppUser user = registrationSessions.get(username);
        if (user != null) {
            UserIdentity userIdentity = user.toUserIdentity();
            StartRegistrationOptions registrationOptions = StartRegistrationOptions.builder()
                    .user(userIdentity)
                    .build();
            PublicKeyCredentialCreationOptions registration = relyingParty.startRegistration(registrationOptions);
            this.requestOptionMap.put(user.getUserName(), registration);

            try {
                return registration.toCredentialsCreateJson();
            } catch (JsonProcessingException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing JSON.", e);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User " + user.getUserName() + " does not exist. Please register.");
        }
    }

    @PostMapping("/finish-auth")
    @ResponseBody
    public ResponseEntity<String> finishRegisration(
            @RequestParam String credential,
            @RequestParam String username,
            @RequestParam String deviceDetails
    ) {
        try {
            AppUser user = registrationSessions.get(username);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User session not found. Please register again.");
            }

            PublicKeyCredentialCreationOptions requestOptions = this.requestOptionMap.get(username);
            if (requestOptions == null) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cached request expired. Try to register again!");
            }

            PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> pkc =
                    PublicKeyCredential.parseRegistrationResponseJson(credential);
            FinishRegistrationOptions options = FinishRegistrationOptions.builder()
                    .request(requestOptions)
                    .response(pkc)
                    .build();

            RegistrationResult result = relyingParty.finishRegistration(options);

            if (service.getAuthRepository().existsByCredentialId(result.getKeyId().getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Device already registered for this user.");
            }

            if (service.getUserRepo().findByUserName(username) == null) {
                service.getUserRepo().save(user);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            String formattedDateTime = LocalDateTime.now().format(formatter);

            Authenticator savedAuth = new Authenticator(result, pkc.getResponse(), user, deviceDetails,formattedDateTime);
            service.getAuthRepository().save(savedAuth);

            return ResponseEntity.ok("Registration successful");
        } catch (RegistrationFailedException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration failed. Please check the request and try again.", e);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to save credential, please try again!", e);
        } finally {
            registrationSessions.remove(username);
            requestOptionMap.remove(username);
        }
    }

    @PostMapping("/webauthn/login")
    @ResponseBody
    public String startLogin(
            @RequestParam String username
    ) {
        AssertionRequest request = relyingParty.startAssertion(StartAssertionOptions.builder()
                .username(username)
                .build());
        try {
            this.assertionRequestMap.put(username, request);
            return request.toCredentialsGetJson();
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/webauthn/finish-login")
    @ResponseBody
    public ResponseEntity<WebauthLoginResponse> finishLogin(
            @RequestParam String credential,
            @RequestParam String username,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        try {
            PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> pkc;
            pkc = PublicKeyCredential.parseAssertionResponseJson(credential);
            AssertionRequest request = this.assertionRequestMap.get(username);
            AssertionResult result = relyingParty.finishAssertion(FinishAssertionOptions.builder()
                    .request(request)
                    .response(pkc)
                    .build());
            if (result.isSuccess()) {
                AppUser appUser = service.getUserRepo().findByUserName(username);
                Users user = appUser.getUsers();

                WebAuthnAuthenticationToken authToken = new WebAuthnAuthenticationToken(user);
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                securityContext.setAuthentication(authToken);

                HttpSession session = httpRequest.getSession(true);
                session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
                SecurityContextHolder.setContext(securityContext);

                httpResponse.setStatus(HttpServletResponse.SC_OK);
                httpResponse.setContentType("application/json; charset=UTF-8");

                System.out.println("Session ID: " + httpRequest.getSession().getId());
                System.out.println("Authentication: " + SecurityContextHolder.getContext().getAuthentication());


                return ResponseEntity.ok(new WebauthLoginResponse("success", "Login successful"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new WebauthLoginResponse("failure", "Login failed"));
            }
        } catch (IOException | AssertionFailedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new WebauthLoginResponse("error", "Authentication failed"));
        }
    }

    @GetMapping("/checkPasskeyRegistration")
    @ResponseBody
    public Map<String, Boolean> checkPasskeyRegistration(@RequestParam String username) {
        boolean isRegistered = service.isUserRegisteredWithPasskey(username);
        return Collections.singletonMap("registered", isRegistered);
    }

    @GetMapping("/devices")
    @ResponseBody
    public List<DeviceDTO> getUserDevices(@RequestParam String username) {
        return service.getUserDevices(username);
    }

    @DeleteMapping("/device/{id}")
    public ResponseEntity<String> deleteDevice(@PathVariable Long id, @RequestParam String username) {
        service.deleteDevice(id, username);
        return ResponseEntity.ok("Device deleted successfully");
    }


}
