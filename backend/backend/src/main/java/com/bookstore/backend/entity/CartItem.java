package com.bookstore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private Long bookId;
    private String title;
    private String image;
    private double price;
    private int quantity;
}
