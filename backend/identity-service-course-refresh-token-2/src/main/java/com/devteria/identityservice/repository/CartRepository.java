package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Book;
import com.devteria.identityservice.entity.CartItem;
import com.devteria.identityservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<CartItem, UUID> {

    List<CartItem> findByUserEmail(String email);

    Optional<CartItem> findByUserEmailAndBookId(String email, UUID bookId);

    Optional<CartItem> findByUserAndBook(User user, Book book);

    void deleteByUserEmail(String email);
}
