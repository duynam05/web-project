package com.devteria.identityservice.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CartQuantityUpdateRequest {
    @Min(value = 1, message = "INVALID_QUANTITY")
    private int quantity;
}
