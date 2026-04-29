package com.duynam.identityservice.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.payment.payos")
public class PayOsProperties {
    private boolean enabled = false;
    private boolean useForBankTransfer = false;
    private String environment = "production";
    private String baseUrl = "https://api-merchant.payos.vn";
    private String clientId = "";
    private String apiKey = "";
    private String checksumKey = "";
    private String partnerCode = "";
    private String webhookUrl = "https://web-project-2-viwf.onrender.com/api/payments/payos/webhook";
    private String returnUrlBase = "https://duynam05.github.io/web-project/#/payment-result";
    private String cancelUrlBase = "https://duynam05.github.io/web-project/#/checkout";
    private Integer expiryMinutes = 15;
    private boolean syncEnabled = true;
    private Long syncFixedDelayMs = 30000L;
    private Integer syncBatchSize = 25;
    private boolean cancelOnOrderCancel = true;
}
