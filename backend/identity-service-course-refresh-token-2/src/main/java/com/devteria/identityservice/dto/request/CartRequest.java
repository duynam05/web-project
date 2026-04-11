package com.devteria.identityservice.dto.request;

import com.devteria.identityservice.validator.ValidCartQuantity;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartRequest {
    @NotNull(message = "Book ID is required")
    private UUID bookId;

    @Min(value = 1, message = "Quantity must be greater than 0")
    @ValidCartQuantity
    private int quantity;
}