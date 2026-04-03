package com.bookstore.backend.controller;

import com.bookstore.backend.entity.CartItem;
import com.bookstore.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{email}")
    public List<CartItem> getCart(@PathVariable String email) {
        return cartService.getCart(email);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartItem item) {
        return cartService.addToCart(item);
    }

    @PutMapping("/{id}")
    public CartItem updateQuantity(@PathVariable Long id, @RequestParam int quantity) {
        return cartService.updateQuantity(id, quantity);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        cartService.deleteItem(id);
    }

    @DeleteMapping("/clear/{email}")
    public void clearCart(@PathVariable String email) {
        cartService.clearCart(email);
    }
}
