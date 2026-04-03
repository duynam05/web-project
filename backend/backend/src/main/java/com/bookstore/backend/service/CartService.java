package com.bookstore.backend.service;

import com.bookstore.backend.entity.CartItem;
import com.bookstore.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public List<CartItem> getCart(String email) {
        return cartRepository.findByUserEmail(email);
    }

    public CartItem addToCart(CartItem item) {
        Optional<CartItem> existing = cartRepository
                .findByUserEmailAndBookId(item.getUserEmail(), item.getBookId());

        if (existing.isPresent()) {
            CartItem cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            return cartRepository.save(cartItem);
        }

        item.setQuantity(1);
        return cartRepository.save(item);
    }

    public CartItem updateQuantity(Long id, int quantity) {
        CartItem item = cartRepository.findById(id).orElseThrow();

        if (quantity <= 0) {
            cartRepository.delete(item);
            return null;
        }

        item.setQuantity(quantity);
        return cartRepository.save(item);
    }

    public void deleteItem(Long id) {
        cartRepository.deleteById(id);
    }

    public void clearCart(String email) {
        List<CartItem> items = cartRepository.findByUserEmail(email);
        cartRepository.deleteAll(items);
    }
}
