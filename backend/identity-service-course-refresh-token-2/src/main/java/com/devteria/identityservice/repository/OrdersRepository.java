package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Orders;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrdersRepository extends JpaRepository<Orders, UUID> {
    @EntityGraph(attributePaths = {"items", "items.book"})
    List<Orders> findByUserEmailOrderByCreatedAtDesc(String email);

    @EntityGraph(attributePaths = {"items", "items.book"})
    Optional<Orders> findByIdAndUserEmail(UUID id, String email);
}
