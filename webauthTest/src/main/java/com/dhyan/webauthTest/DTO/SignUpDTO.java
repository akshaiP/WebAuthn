package com.dhyan.webauthTest.DTO;

import lombok.Data;

@Data
public class SignUpDTO {
    private String username;
    private String password;
    private String email;
    private String role;
}
