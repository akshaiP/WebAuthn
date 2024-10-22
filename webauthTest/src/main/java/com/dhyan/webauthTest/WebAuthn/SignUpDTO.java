package com.dhyan.webauthTest.WebAuthn;

import lombok.Data;

@Data
public class SignUpDTO {
    private String username;
    private String password;
    private String email;
    private String role;
}
