package com.duynam.identityservice.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

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
public class CartItemResponse {
    UUID id;
    UUID bookId;
    String title;
    String image;
    BigDecimal unitPrice;
    int quantity;
    BigDecimal lineTotal;
    Integer availableStock;
}

