//package com.devteria.identityservice.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.math.BigDecimal;
//import java.util.UUID;
//
//@Entity
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class CartItem {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;
//
//    private BigDecimal price;
//    private String title;
//    private String image;
//
//    @ManyToOne
//    @JoinColumn(name = "book_id")
//    private Book book;
//
//    private int quantity;
//}


package com.devteria.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_book",
                        columnNames = {"user_id", "book_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    // Người sở hữu giỏ hàng
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Sách được thêm vào giỏ
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // Giá tại thời điểm thêm vào giỏ
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    // Snapshot thông tin sách
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String image;

    // Số lượng sản phẩm
    @Column(nullable = false)
    private int quantity;
}
