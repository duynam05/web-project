package com.duynam.identityservice.controller;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.identityservice.dto.request.ApiResponse;
import com.duynam.identityservice.dto.request.CartQuantityUpdateRequest;
import com.duynam.identityservice.dto.request.CartRequest;
import com.duynam.identityservice.dto.response.CartResponse;
import com.duynam.identityservice.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart(Authentication authentication) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCart(authentication.getName()))
                .build();
    }

    @PostMapping
    public ApiResponse<CartResponse> addToCart(
            @Valid @RequestBody CartRequest request, Authentication authentication) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.addToCart(authentication.getName(), request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<CartResponse> delete(@PathVariable UUID id, Authentication authentication) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.deleteItem(authentication.getName(), id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CartResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CartQuantityUpdateRequest body,
            Authentication authentication) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.updateQuantity(authentication.getName(), id, body.getQuantity()))
                .build();
    }

    @DeleteMapping("/clear")
    public ApiResponse<CartResponse> clear(Authentication authentication) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.clearCart(authentication.getName()))
                .build();
    }
}

