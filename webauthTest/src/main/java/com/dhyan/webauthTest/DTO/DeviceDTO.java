package com.dhyan.webauthTest.DTO;

import lombok.Data;

@Data
public class DeviceDTO {
    private long id;
    private String deviceLabel;
    private String dateTime;

    public DeviceDTO(long id, String deviceLabel, String dateTime) {
        this.id = id;
        this.deviceLabel = deviceLabel;
        this.dateTime = dateTime;
    }
}
