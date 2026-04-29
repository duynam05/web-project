package com.duynam.identityservice.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.identityservice.dto.request.PayOsWebhookRequest;
import com.duynam.identityservice.service.OrdersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments/payos")
@RequiredArgsConstructor
public class PayOsWebhookController {

    private static final Logger log = LoggerFactory.getLogger(PayOsWebhookController.class);

    private final OrdersService ordersService;

    @PostMapping("/webhook")
    public Map<String, Object> receiveWebhook(@RequestBody PayOsWebhookRequest request) {
        log.info("payOS webhook received: code={}, success={}, orderCode={}, paymentLinkId={}, signaturePresent={}",
                request != null ? request.getCode() : null,
                request != null ? request.getSuccess() : null,
                request != null && request.getData() != null ? request.getData().getOrderCode() : null,
                request != null && request.getData() != null ? request.getData().getPaymentLinkId() : null,
                request != null && request.getSignature() != null && !request.getSignature().isBlank());
        boolean accepted = ordersService.handlePayOsWebhook(request);
        log.info("payOS webhook processed: accepted={}", accepted);
        return Map.of(
                "error", 0,
                "message", accepted ? "Webhook processed" : "Webhook ignored"
        );
    }
}
