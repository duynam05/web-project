package com.devteria.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Người đặt hàng
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Tổng tiền
    @Column(nullable = false)
    private BigDecimal totalPrice;

    // Thông tin giao hàng
    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, length = 255)
    private String address;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    // Trạng thái đơn hàng
    @Column(nullable = false)
    private String status;

    @Column(length = 32)
    private String paymentMethod;

    @Column(length = 32)
    private String paymentStatus;

    @Column(length = 64)
    private String paymentReference;

    @Column
    private LocalDateTime paidAt;

    // Thời gian tạo đơn
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Danh sách sản phẩm trong đơn
    @OneToMany(mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true)

    @Builder.Default
    private List<OrderItems> items = new ArrayList<>();

    // Tự động set thời gian khi tạo
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
