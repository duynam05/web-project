package com.duynam.identityservice.dto.request;

import java.math.BigDecimal;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PayOsWebhookRequest {
    String code;
    String desc;
    Boolean success;
    PayOsWebhookData data;
    String signature;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PayOsWebhookData {
        Long orderCode;
        BigDecimal amount;
        String description;
        String accountNumber;
        String reference;
        String transactionDateTime;
        String currency;
        String paymentLinkId;
        String code;
        String desc;
        String counterAccountBankId;
        String counterAccountBankName;
        String counterAccountName;
        String counterAccountNumber;
        String virtualAccountName;
        String virtualAccountNumber;
    }
}
