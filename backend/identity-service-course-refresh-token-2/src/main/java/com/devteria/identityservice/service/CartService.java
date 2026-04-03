package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.CartRequest;
import com.devteria.identityservice.entity.Book;
import com.devteria.identityservice.entity.CartItem;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.repository.BookRepository;
import com.devteria.identityservice.repository.CartRepository;
import com.devteria.identityservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // 🛒 GET
    public List<CartItem> getCart(String email) {
        return cartRepository.findByUserEmail(email);
    }

    // ➕ ADD
    public void addToCart(String email, CartRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Optional<CartItem> existing =
                cartRepository.findByUserAndBook(user, book);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartRepository.save(item);

        } else {
            CartItem item = CartItem.builder()
                    .user(user)
                    .book(book)
                    .quantity(request.getQuantity())
                    .price(book.getPrice())     // ✅ FIX
                    .title(book.getTitle())     // ✅ FIX
                    .image(book.getImage())     // ✅ FIX
                    .build();

            cartRepository.save(item);
        }
    }

    // ❌ DELETE
    public void deleteItem(String id) {
        cartRepository.deleteById(id);
    }

    // 🔄 UPDATE
    public void updateQuantity(String id, int quantity) {
        CartItem item = cartRepository.findById(id).orElseThrow();
        item.setQuantity(quantity);
        cartRepository.save(item);
    }

    // 🧹 CLEAR
    @Transactional
    public void clearCart(String email) {
        cartRepository.deleteByUserEmail(email);
    }
}
