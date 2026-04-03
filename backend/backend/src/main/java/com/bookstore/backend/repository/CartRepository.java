package com.bookstore.backend.repository;

import com.bookstore.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserEmail(String userEmail);

    Optional<CartItem> findByUserEmailAndBookId(String userEmail, Long bookId);
}
