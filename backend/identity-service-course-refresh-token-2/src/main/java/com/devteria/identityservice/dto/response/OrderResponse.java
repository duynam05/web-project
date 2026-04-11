package com.devteria.identityservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Integer orderId;
    private BigDecimal totalPrice;
    private String status;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    public OrderResponse(Integer orderId, BigDecimal totalPrice, String status,
                         String phone, String address, LocalDateTime createdAt,
                         List<OrderItemResponse> items) {
        this.orderId = orderId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.phone = phone;
        this.address = address;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Integer getOrderId() { return orderId; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<OrderItemResponse> getItems() { return items; }
}
