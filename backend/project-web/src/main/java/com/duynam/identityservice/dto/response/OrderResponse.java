package com.duynam.identityservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String orderId;
    String customerId;
    String customerEmail;
    String customerName;
    BigDecimal totalPrice;
    String status;
    String phone;
    String address;
    Double latitude;
    Double longitude;
    String paymentMethod;
    String paymentStatus;
    String paymentReference;
    LocalDateTime createdAt;
    LocalDateTime paidAt;
    List<OrderItemResponse> items;
}

