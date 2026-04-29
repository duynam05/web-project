package com.duynam.identityservice.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.payment.bank-transfer")
public class BankTransferProperties {
    private String bankId = "970418";
    private String bankName = "BIDV";
    private String accountNumber = "8860383073";
    private String accountHolder = "TRINH DUY NAM";
    private Integer sessionExpiryMinutes = 15;
}
