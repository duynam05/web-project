package com.duynam.identityservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
public class PaymentSessionResponse {
    String sessionId;
    String provider;
    String status;
    BigDecimal amount;
    String reference;
    String bankName;
    String accountNumber;
    String accountHolder;
    String qrUrl;
    String paymentUrl;
    String providerTransactionId;
    Long providerOrderCode;
    String providerPaymentLinkId;
    LocalDateTime expiresAt;
    LocalDateTime confirmedAt;
    LocalDateTime createdAt;
}
