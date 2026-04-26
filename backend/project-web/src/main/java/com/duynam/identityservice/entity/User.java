package com.duynam.identityservice.entity;

import java.time.LocalDate;
import java.util.Set;

import com.duynam.identityservice.constant.UserStatus;
import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, unique = true)
    String email;

    @Column(nullable = false)
    String password;

    String fullName;
    LocalDate dob;
    String phone;
    String address;
    String bio;
    Boolean twoFactorEnabled;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    UserStatus status = UserStatus.ACTIVE;

    @ManyToMany
    Set<Role> roles;
}

