package com.duynam.identityservice.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.bootstrap.admin")
public class BootstrapAdminProperties {
    boolean enabled = true;
    String email;
    String password;
    String fullName = "Administrator";
}

