package com.devteria.identityservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.request.OrderPaymentRequest;
import com.devteria.identityservice.dto.request.OrderRequest;
import com.devteria.identityservice.dto.response.OrderResponse;
import com.devteria.identityservice.service.OrdersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(
            @RequestBody OrderRequest request, Authentication authentication) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.createOrder(authentication.getName(), request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getMyOrders(Authentication authentication) {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(ordersService.getOrdersByUser(authentication.getName()))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable UUID orderId, Authentication authentication) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.getOrderById(authentication.getName(), orderId))
                .build();
    }

    @PostMapping("/{orderId}/payment")
    public ApiResponse<OrderResponse> payOrder(
            @PathVariable UUID orderId,
            @RequestBody(required = false) OrderPaymentRequest request,
            Authentication authentication) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.payOrder(authentication.getName(), orderId, request))
                .build();
    }
}
