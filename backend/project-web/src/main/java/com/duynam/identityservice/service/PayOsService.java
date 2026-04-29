package com.duynam.identityservice.service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.StringJoiner;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import com.duynam.identityservice.configuration.PayOsProperties;
import com.duynam.identityservice.dto.request.PayOsWebhookRequest;
import com.duynam.identityservice.entity.Orders;
import com.duynam.identityservice.entity.PaymentSession;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayOsService {

    private static final Logger log = LoggerFactory.getLogger(PayOsService.class);

    private final PayOsProperties payOsProperties;

    public boolean isEnabledForBankTransfer() {
        return payOsProperties.isEnabled() && payOsProperties.isUseForBankTransfer();
    }

    public PayOsCreatePaymentResponse createPaymentLink(Orders order, long providerOrderCode) {
        RestClient client = buildClient();

        String description = buildDescription(order);
        String returnUrl = buildReturnUrl(order);
        String cancelUrl = buildCancelUrl(order);
        long expiredAt = Instant.now().getEpochSecond() + (payOsProperties.getExpiryMinutes() * 60L);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("orderCode", providerOrderCode);
        body.put("amount", order.getTotalPrice().intValue());
        body.put("description", description);
        body.put("buyerName", order.getUser() != null ? order.getUser().getFullName() : null);
        body.put("buyerEmail", order.getUser() != null ? order.getUser().getEmail() : null);
        body.put("buyerPhone", order.getPhone());
        body.put("buyerAddress", order.getAddress());
        body.put("items", order.getItems().stream().map(item -> Map.of(
                "name", item.getTitle(),
                "quantity", item.getQuantity(),
                "price", item.getPrice().intValue(),
                "unit", "cuon"
        )).toList());
        body.put("cancelUrl", cancelUrl);
        body.put("returnUrl", returnUrl);
        body.put("expiredAt", expiredAt);
        body.put("signature", signCreatePayment(order.getTotalPrice(), cancelUrl, description, providerOrderCode, returnUrl));

        return client.post()
                .uri("/v2/payment-requests")
                .body(body)
                .retrieve()
                .body(PayOsCreatePaymentResponse.class);
    }

    public PayOsPaymentInfoResponse getPaymentLinkInformation(String idOrOrderCode) {
        return buildClient().get()
                .uri("/v2/payment-requests/{id}", idOrOrderCode)
                .retrieve()
                .body(PayOsPaymentInfoResponse.class);
    }

    public PayOsPaymentInfoResponse cancelPaymentLink(String idOrOrderCode, String cancellationReason) {
        return buildClient().post()
                .uri("/v2/payment-requests/{id}/cancel", idOrOrderCode)
                .body(Map.of("cancellationReason", defaultString(cancellationReason)))
                .retrieve()
                .body(PayOsPaymentInfoResponse.class);
    }

    public boolean verifyWebhookSignature(PayOsWebhookRequest request) {
        if (request == null || request.getData() == null || request.getSignature() == null) {
            return false;
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("amount", request.getData().getAmount() != null ? request.getData().getAmount().stripTrailingZeros().toPlainString() : "");
        data.put("accountNumber", defaultString(request.getData().getAccountNumber()));
        data.put("code", defaultString(request.getData().getCode()));
        data.put("counterAccountBankId", defaultString(request.getData().getCounterAccountBankId()));
        data.put("counterAccountBankName", defaultString(request.getData().getCounterAccountBankName()));
        data.put("counterAccountName", defaultString(request.getData().getCounterAccountName()));
        data.put("counterAccountNumber", defaultString(request.getData().getCounterAccountNumber()));
        data.put("currency", defaultString(request.getData().getCurrency()));
        data.put("desc", defaultString(request.getData().getDesc()));
        data.put("description", defaultString(request.getData().getDescription()));
        data.put("orderCode", request.getData().getOrderCode() != null ? request.getData().getOrderCode().toString() : "");
        data.put("paymentLinkId", defaultString(request.getData().getPaymentLinkId()));
        data.put("reference", defaultString(request.getData().getReference()));
        data.put("transactionDateTime", defaultString(request.getData().getTransactionDateTime()));
        data.put("virtualAccountName", defaultString(request.getData().getVirtualAccountName()));
        data.put("virtualAccountNumber", defaultString(request.getData().getVirtualAccountNumber()));

        return hmacSha256(toSortedQueryString(data), payOsProperties.getChecksumKey())
                .equalsIgnoreCase(request.getSignature());
    }

    public String buildQrImageUrl(PaymentSession session) {
        if (session == null || session.getQrUrl() == null || session.getQrUrl().isBlank()) {
            return "";
        }

        return "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data="
                + URLEncoder.encode(session.getQrUrl(), StandardCharsets.UTF_8);
    }

    public String resolveNormalizedStatus(PayOsPaymentInfoResponse response) {
        if (response == null || response.data == null || response.data.status == null) {
            return "";
        }
        return response.data.status.trim().toUpperCase();
    }

    private RestClient buildClient() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl(payOsProperties.getBaseUrl())
                .defaultHeader("x-client-id", payOsProperties.getClientId())
                .defaultHeader("x-api-key", payOsProperties.getApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if (StringUtils.hasText(payOsProperties.getPartnerCode())) {
            builder.defaultHeader("x-partner-code", payOsProperties.getPartnerCode());
        }

        return builder.build();
    }

    private String buildDescription(Orders order) {
        return "DH " + order.getId().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    private String buildReturnUrl(Orders order) {
        return payOsProperties.getReturnUrlBase() + "?orderId=" + order.getId();
    }

    private String buildCancelUrl(Orders order) {
        return payOsProperties.getCancelUrlBase() + "?orderId=" + order.getId();
    }

    private String signCreatePayment(BigDecimal amount, String cancelUrl, String description, long orderCode, String returnUrl) {
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("amount", String.valueOf(amount.intValue()));
        payload.put("cancelUrl", cancelUrl);
        payload.put("description", description);
        payload.put("orderCode", String.valueOf(orderCode));
        payload.put("returnUrl", returnUrl);
        return hmacSha256(toSortedQueryString(payload), payOsProperties.getChecksumKey());
    }

    private String toSortedQueryString(Map<String, ?> data) {
        return data.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + normalizeValue(entry.getValue()))
                .reduce((left, right) -> left + "&" + right)
                .orElse("");
    }

    private String normalizeValue(Object value) {
        if (value == null) return "";
        String normalized = String.valueOf(value);
        if ("undefined".equalsIgnoreCase(normalized) || "null".equalsIgnoreCase(normalized)) {
            return "";
        }
        return normalized;
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }

    private String hmacSha256(String data, String checksumKey) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(checksumKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringJoiner joiner = new StringJoiner("");
            for (byte b : hash) {
                joiner.add(String.format("%02x", b));
            }
            return joiner.toString();
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to sign payOS request", exception);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PayOsCreatePaymentResponse {
        public String code;
        public String desc;
        public PayOsCreatePaymentData data;
        public String signature;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PayOsCreatePaymentData {
        public String bin;
        public String accountNumber;
        public String accountName;
        public Integer amount;
        public String description;
        public Long orderCode;
        public String currency;
        @JsonProperty("paymentLinkId")
        public String paymentLinkId;
        public String status;
        @JsonProperty("checkoutUrl")
        public String checkoutUrl;
        @JsonProperty("qrCode")
        public String qrCode;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PayOsPaymentInfoResponse {
        public String code;
        public String desc;
        public PayOsPaymentInfoData data;
        public String signature;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PayOsPaymentInfoData {
        public String id;
        public Long orderCode;
        public Integer amount;
        public Integer amountPaid;
        public Integer amountRemaining;
        public String status;
        public String createdAt;
        public String canceledAt;
    }
}
