package com.duynam.identityservice.repository;

import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.entity.CartItem;
import com.duynam.identityservice.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<CartItem, UUID> {

    @EntityGraph(attributePaths = {"book"})
    List<CartItem> findAllByUserEmailOrderByIdAsc(String email);

    Optional<CartItem> findByUserEmailAndBookId(String email, UUID bookId);

    Optional<CartItem> findByUserAndBook(User user, Book book);

    @EntityGraph(attributePaths = {"book"})
    Optional<CartItem> findByIdAndUserEmail(UUID id, String email);

    long deleteByIdAndUserEmail(UUID id, String email);

    void deleteByUserEmail(String email);
}

