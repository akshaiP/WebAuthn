package com.dhyan.webauthTest.Configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
@Data
@ConfigurationProperties(prefix = "authn")
public class WebAuthProperties {

    private String hostName;
    private String display;
    private Set<String> origin;
}
