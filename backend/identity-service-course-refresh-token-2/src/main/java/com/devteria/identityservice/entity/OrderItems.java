package com.devteria.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItems {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Liên kết tới đơn hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    // Liên kết tới sách
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // Giá tại thời điểm đặt hàng
    @Column(nullable = false)
    private BigDecimal price;

    // Thông tin snapshot để tránh thay đổi khi sách bị chỉnh sửa
    private String title;

    private String image;

    // Số lượng
    @Column(nullable = false)
    private int quantity;
}
