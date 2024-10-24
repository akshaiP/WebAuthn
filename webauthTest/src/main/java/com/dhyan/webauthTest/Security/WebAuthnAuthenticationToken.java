package com.dhyan.webauthTest.Security;

import com.dhyan.webauthTest.UserData.AppUser;
import org.springframework.security.authentication.AbstractAuthenticationToken;

public class WebAuthnAuthenticationToken extends AbstractAuthenticationToken {

    private final AppUser appUser;

    public WebAuthnAuthenticationToken(AppUser appUser) {
        super(null);
        this.appUser = appUser;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return this.appUser;
    }
}
