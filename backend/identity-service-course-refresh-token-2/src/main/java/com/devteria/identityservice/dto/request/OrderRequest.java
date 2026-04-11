package com.devteria.identityservice.dto.request;

import lombok.Data;

@Data
public class OrderRequest {
    private String phone;
    private String address;
//    private String fullName;
//    private String email;

    private Double latitude;
    private Double longitude;
}