package com.dhyan.webauthTest;

import com.dhyan.webauthTest.Configuration.WebAuthProperties;
import com.dhyan.webauthTest.WebAuthn.RegistrationService;
import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.data.RelyingPartyIdentity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class WebauthTestApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebauthTestApplication.class, args);
	}

	@Bean
	public RelyingParty relyingParty(RegistrationService registrationRepository,
									 WebAuthProperties properties) {
		RelyingPartyIdentity rpIdentity = RelyingPartyIdentity.builder()
				.id(properties.getHostName())
				.name(properties.getDisplay())
				.build();

		return RelyingParty.builder()
				.identity(rpIdentity)
				.credentialRepository(registrationRepository)
				.origins(properties.getOrigin())
				.build();
	}
}
