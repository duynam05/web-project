package com.duynam.identityservice.dto.request;

import lombok.Data;

@Data
public class OrderRequest {
    private String phone;
    private String address;
    private Double latitude;
    private Double longitude;
    private String paymentMethod;
}
