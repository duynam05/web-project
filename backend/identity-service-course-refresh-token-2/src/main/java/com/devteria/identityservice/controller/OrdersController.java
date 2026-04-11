package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.OrderRequest;
import com.devteria.identityservice.entity.Orders;
import com.devteria.identityservice.service.OrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;

    @PostMapping
    public Orders createOrder(@RequestBody OrderRequest request,
                              Authentication authentication) {
        return ordersService.createOrder(authentication.getName(), request);
    }

    @GetMapping
    public List<Orders> getMyOrders(Authentication authentication) {
        return ordersService.getOrdersByUser(authentication.getName());
    }
}