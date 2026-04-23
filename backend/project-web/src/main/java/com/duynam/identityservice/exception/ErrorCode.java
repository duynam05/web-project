package com.duynam.identityservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Email must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    DATABASE_ERROR(1009, "Database error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST_BODY(1010, "Request body is missing or invalid", HttpStatus.BAD_REQUEST),
    OUT_OF_STOCK(1011, "Quantity exceeds available stock", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(1012, "Book not found", HttpStatus.NOT_FOUND),
    CART_EMPTY(1013, "Cart is empty", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(1014, "Cart item not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(1015, "Order not found", HttpStatus.NOT_FOUND),
    INVALID_PAYMENT_METHOD(1016, "Invalid payment method", HttpStatus.BAD_REQUEST),
    PAYMENT_ALREADY_COMPLETED(1017, "Order payment has already been completed", HttpStatus.BAD_REQUEST),
    PAYMENT_METHOD_NOT_SUPPORTED(1018, "Only ONLINE payment is supported for this endpoint", HttpStatus.BAD_REQUEST),
    INVALID_QUANTITY(1019, "Quantity must be greater than 0", HttpStatus.BAD_REQUEST),
    BOOK_ID_REQUIRED(1020, "Book ID is required", HttpStatus.BAD_REQUEST),
    BOOTSTRAP_CONFIG_MISSING(1021, "Admin bootstrap configuration is missing", HttpStatus.INTERNAL_SERVER_ERROR),
    ACCOUNT_DISABLED(1022, "Account is disabled", HttpStatus.FORBIDDEN),
    INVALID_CURRENT_PASSWORD(1023, "Current password is invalid", HttpStatus.BAD_REQUEST),
    INVALID_NEW_PASSWORD(1024, "New password must be at least 6 characters", HttpStatus.BAD_REQUEST),
    INVALID_USER_STATUS(1025, "User status is invalid", HttpStatus.BAD_REQUEST),
    CLOUDINARY_NOT_CONFIGURED(1026, "Cloudinary is not configured", HttpStatus.INTERNAL_SERVER_ERROR),
    CLOUDINARY_UPLOAD_FAILED(1027, "Cloudinary upload failed", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_BE_CANCELLED(1028, "Order cannot be cancelled at its current status", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_STATUS(1029, "Order status is invalid", HttpStatus.BAD_REQUEST),
    ORDER_STATUS_TRANSITION_NOT_ALLOWED(1030, "Order status transition is not allowed", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}

