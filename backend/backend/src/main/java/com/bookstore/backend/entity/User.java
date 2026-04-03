package com.bookstore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // 👈 thêm dòng này
}