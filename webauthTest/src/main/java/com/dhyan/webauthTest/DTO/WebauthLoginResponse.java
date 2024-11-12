package com.dhyan.webauthTest.DTO;

import lombok.Data;

@Data
public class WebauthLoginResponse {
    private String status;
    private String message;

    public WebauthLoginResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }
}
