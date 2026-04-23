package com.duynam.identityservice.dto.request;

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
    @NotNull(message = "BOOK_ID_REQUIRED")
    private UUID bookId;

    @Min(value = 1, message = "INVALID_QUANTITY")
    private int quantity;
}

