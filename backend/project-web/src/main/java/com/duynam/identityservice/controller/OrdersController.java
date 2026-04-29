package com.duynam.identityservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.identityservice.dto.request.ApiResponse;
import com.duynam.identityservice.dto.request.OrderPaymentRequest;
import com.duynam.identityservice.dto.request.OrderRequest;
import com.duynam.identityservice.dto.request.OrderStatusUpdateRequest;
import com.duynam.identityservice.dto.response.OrderResponse;
import com.duynam.identityservice.service.OrdersService;

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

    @GetMapping("/admin")
    public ApiResponse<List<OrderResponse>> getAllOrdersForAdmin() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(ordersService.getAllOrders())
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable UUID orderId, Authentication authentication) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.getOrderById(authentication.getName(), orderId))
                .build();
    }

    @GetMapping("/{orderId}/payment-session")
    public ApiResponse<OrderResponse> getPaymentSession(@PathVariable UUID orderId, Authentication authentication) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.getPaymentSession(authentication.getName(), orderId))
                .build();
    }

    @GetMapping("/admin/{orderId}")
    public ApiResponse<OrderResponse> getOrderForAdmin(@PathVariable UUID orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.getOrderByIdForAdmin(orderId))
                .build();
    }

    @GetMapping("/admin/{orderId}/payment-session")
    public ApiResponse<OrderResponse> getPaymentSessionForAdmin(@PathVariable UUID orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.getPaymentSessionForAdmin(orderId))
                .build();
    }

    @PatchMapping("/admin/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestBody OrderStatusUpdateRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.updateOrderStatus(orderId, request != null ? request.getStatus() : null))
                .build();
    }

    @PostMapping("/admin/{orderId}/confirm-payment")
    public ApiResponse<OrderResponse> confirmBankTransferPayment(@PathVariable UUID orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.confirmBankTransferPayment(orderId))
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

    @PostMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(
            @PathVariable UUID orderId,
            Authentication authentication) {
        return ApiResponse.<OrderResponse>builder()
                .result(ordersService.cancelOrder(authentication.getName(), orderId))
                .build();
    }
}

