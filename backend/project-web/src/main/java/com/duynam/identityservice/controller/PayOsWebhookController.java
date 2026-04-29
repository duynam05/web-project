package com.duynam.identityservice.controller;

import java.util.Map;

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

    private final OrdersService ordersService;

    @PostMapping("/webhook")
    public Map<String, Object> receiveWebhook(@RequestBody PayOsWebhookRequest request) {
        boolean accepted = ordersService.handlePayOsWebhook(request);
        return Map.of(
                "error", 0,
                "message", accepted ? "Webhook processed" : "Webhook ignored"
        );
    }
}
