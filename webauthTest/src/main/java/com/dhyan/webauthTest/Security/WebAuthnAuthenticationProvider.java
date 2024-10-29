package com.dhyan.webauthTest.Security;

import com.dhyan.webauthTest.Users.Users;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@Component
public class WebAuthnAuthenticationProvider implements AuthenticationProvider {

    private final UserDetailsService userDetailsService;

    public WebAuthnAuthenticationProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = (String) authentication.getPrincipal();

        Users user = (Users) userDetailsService.loadUserByUsername(username);

        if (user.getAppUser() != null) {
            return new WebAuthnAuthenticationToken(user);
        }

        throw new AuthenticationCredentialsNotFoundException("WebAuthn authentication failed for user " + username);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return WebAuthnAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
