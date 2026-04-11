package com.devteria.identityservice.validator;

import com.devteria.identityservice.dto.request.OrderRequest;
import org.springframework.stereotype.Component;

@Component

public class OrderValidator {
    public void validate(OrderRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Order request must not be null");
        }

        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone must not be blank");
        }

        // Kiểm tra định dạng số điện thoại Việt Nam
        String phoneRegex = "^(0|\\+84)[0-9]{9}$";
        if (!request.getPhone().matches(phoneRegex)) {
            throw new IllegalArgumentException("Invalid Vietnamese phone number");
        }

        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Address must not be blank");
        }

        if (request.getAddress().length() > 255) {
            throw new IllegalArgumentException("Address must not exceed 255 characters");
        }
    }
}
