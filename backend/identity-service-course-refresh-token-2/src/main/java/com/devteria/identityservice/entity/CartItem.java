package com.devteria.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private double price;   // ✅ THÊM DÒNG NÀY
    private String title;   // (nếu dùng)
    private String image;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    private int quantity;
}
