package com.duynam.identityservice.service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.StringJoiner;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
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

    private final PayOsProperties payOsProperties;

    public boolean isEnabledForBankTransfer() {
        return payOsProperties.isEnabled() && payOsProperties.isUseForBankTransfer();
    }

    public PayOsCreatePaymentResponse createPaymentLink(Orders order, long providerOrderCode) {
        RestClient client = RestClient.builder()
                .baseUrl(payOsProperties.getBaseUrl())
                .defaultHeader("x-client-id", payOsProperties.getClientId())
                .defaultHeader("x-api-key", payOsProperties.getApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

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

        return hmacSha256(toSortedQueryString(data, false), payOsProperties.getChecksumKey())
                .equalsIgnoreCase(request.getSignature());
    }

    public String buildQrImageUrl(PaymentSession session) {
        if (session == null || session.getQrUrl() == null || session.getQrUrl().isBlank()) {
            return "";
        }

        return "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data="
                + URLEncoder.encode(session.getQrUrl(), StandardCharsets.UTF_8);
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
        return hmacSha256(toSortedQueryString(payload, false), payOsProperties.getChecksumKey());
    }

    private String toSortedQueryString(Map<String, ?> data, boolean encodeValues) {
        return data.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + normalizeValue(entry.getValue(), encodeValues))
                .reduce((left, right) -> left + "&" + right)
                .orElse("");
    }

    private String normalizeValue(Object value, boolean encodeValues) {
        String normalized = value == null ? "" : String.valueOf(value);
        return encodeValues ? URI.create("http://dummy?" + normalized).getQuery() : normalized;
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
}
