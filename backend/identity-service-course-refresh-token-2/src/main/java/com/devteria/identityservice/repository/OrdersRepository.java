package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, String> {
    List<Orders> findByUserEmail(String email);
}