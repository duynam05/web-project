package com.devteria.identityservice.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String phone;
    private String address;
}
