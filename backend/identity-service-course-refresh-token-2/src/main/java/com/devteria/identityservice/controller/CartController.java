package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.CartRequest;
import com.devteria.identityservice.entity.CartItem;
import com.devteria.identityservice.service.CartService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartItem> getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping
    public void addToCart(@RequestBody CartRequest request, Principal principal) {
        cartService.addToCart(principal.getName(), request);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        cartService.deleteItem(id);
    }

    @PutMapping("/{id}")
    public void update(
            @PathVariable String id,
            @RequestBody Map<String, Integer> body
    ) {
        cartService.updateQuantity(id, body.get("quantity"));
    }

    @DeleteMapping("/clear")
    public void clear(Authentication authentication) {
        cartService.clearCart(authentication.getName());
    }
}
