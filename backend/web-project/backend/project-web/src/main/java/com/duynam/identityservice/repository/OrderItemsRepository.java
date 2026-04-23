package com.duynam.identityservice.repository;

import com.duynam.identityservice.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderItemsRepository extends JpaRepository<OrderItems, UUID> {
    List<OrderItems> findByOrderId(UUID orderId);
}

