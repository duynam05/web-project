package com.devteria.identityservice.dto.response;

import java.math.BigDecimal;

public class OrderItemResponse {
    private String bookId;
    private Integer quantity;
    private Double price;

    public OrderItemResponse(String bookId, Integer quantity, Double price) {
        this.bookId = bookId;
        this.quantity = quantity;
        this.price = price;
    }

    public String getBookId() {
        return bookId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getPrice() {
        return price;
    }
}
