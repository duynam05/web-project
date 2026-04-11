package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.OrderRequest;
import com.devteria.identityservice.entity.*;
import com.devteria.identityservice.repository.*;
import com.devteria.identityservice.validator.OrderValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepository ordersRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderValidator orderValidator;

    @Transactional
    public Orders createOrder(String email, OrderRequest request) {

        orderValidator.validate(request);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartRepository.findByUserEmail(email);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Orders order = Orders.builder()
                .user(user)
                .phone(request.getPhone())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status("PENDING")
                .totalPrice(BigDecimal.ZERO)
                .build();

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Book book = bookRepository.findById(cartItem.getBook().getId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            if (book.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for book: " + book.getTitle()
                );
            }

            book.setStock(book.getStock() - cartItem.getQuantity());

            OrderItems item = OrderItems.builder()
                    .order(order)
                    .book(book)
                    .price(book.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build();

            order.getItems().add(item);

            totalPrice = totalPrice.add(
                    book.getPrice().multiply(
                            BigDecimal.valueOf(cartItem.getQuantity())
                    )
            );
        }

        order.setTotalPrice(totalPrice);

        Orders savedOrder = ordersRepository.save(order);

        cartRepository.deleteByUserEmail(email);

        return savedOrder;
    }

    public List<Orders> getOrdersByUser(String email) {
        return ordersRepository.findByUserEmail(email);
    }
}