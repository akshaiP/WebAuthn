package com.dhyan.webauthTest.Security;

import com.dhyan.webauthTest.Users.Users;
import org.springframework.security.authentication.AbstractAuthenticationToken;

public class WebAuthnAuthenticationToken extends AbstractAuthenticationToken {

    private final Users user;

    public WebAuthnAuthenticationToken(Users user) {
        super(user.getAuthorities());
        this.user = user;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return this.user;
    }
}
