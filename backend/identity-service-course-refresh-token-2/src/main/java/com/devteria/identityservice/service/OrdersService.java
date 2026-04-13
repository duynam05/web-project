package com.devteria.identityservice.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteria.identityservice.constant.OrderStatus;
import com.devteria.identityservice.constant.PaymentMethod;
import com.devteria.identityservice.constant.PaymentStatus;
import com.devteria.identityservice.dto.request.OrderPaymentRequest;
import com.devteria.identityservice.dto.request.OrderRequest;
import com.devteria.identityservice.dto.response.OrderItemResponse;
import com.devteria.identityservice.dto.response.OrderResponse;
import com.devteria.identityservice.entity.Book;
import com.devteria.identityservice.entity.CartItem;
import com.devteria.identityservice.entity.OrderItems;
import com.devteria.identityservice.entity.Orders;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.repository.BookRepository;
import com.devteria.identityservice.repository.CartRepository;
import com.devteria.identityservice.repository.OrdersRepository;
import com.devteria.identityservice.repository.UserRepository;
import com.devteria.identityservice.validator.OrderValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepository ordersRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderValidator orderValidator;

    @Transactional
    public OrderResponse createOrder(String email, OrderRequest request) {
        orderValidator.validate(request);
        String paymentMethod = normalizePaymentMethod(request.getPaymentMethod());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<CartItem> cartItems = cartRepository.findAllByUserEmailOrderByIdAsc(email);
        if (cartItems.isEmpty()) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }

        Orders order = Orders.builder()
                .user(user)
                .phone(request.getPhone())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(resolveInitialOrderStatus(paymentMethod))
                .paymentMethod(paymentMethod)
                .paymentStatus(resolveInitialPaymentStatus(paymentMethod))
                .totalPrice(BigDecimal.ZERO)
                .build();

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Book book = bookRepository.findById(cartItem.getBook().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

            if (book.getStock() == null || book.getStock() < cartItem.getQuantity()) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }

            book.setStock(book.getStock() - cartItem.getQuantity());

            OrderItems item = OrderItems.builder()
                    .order(order)
                    .book(book)
                    .price(book.getPrice())
                    .title(cartItem.getTitle())
                    .image(cartItem.getImage())
                    .quantity(cartItem.getQuantity())
                    .build();

            order.getItems().add(item);
            totalPrice = totalPrice.add(book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotalPrice(totalPrice);

        Orders savedOrder = ordersRepository.save(order);
        cartRepository.deleteByUserEmail(email);

        return toOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(String email) {
        return ordersRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String email, UUID orderId) {
        return toOrderResponse(findOrderForUser(email, orderId));
    }

    @Transactional
    public OrderResponse payOrder(String email, UUID orderId, OrderPaymentRequest request) {
        Orders order = findOrderForUser(email, orderId);

        if (PaymentStatus.PAID.equals(order.getPaymentStatus())) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        String paymentMethod = normalizePaymentMethod(
                request != null ? request.getPaymentMethod() : order.getPaymentMethod());
        if (!PaymentMethod.ONLINE.equals(paymentMethod)) {
            throw new AppException(ErrorCode.PAYMENT_METHOD_NOT_SUPPORTED);
        }

        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaymentReference("PAY-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        order.setPaidAt(LocalDateTime.now());

        if (OrderStatus.PENDING.equals(order.getStatus()) || OrderStatus.PENDING_PAYMENT.equals(order.getStatus())) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        return toOrderResponse(ordersRepository.save(order));
    }

    private Orders findOrderForUser(String email, UUID orderId) {
        return ordersRepository.findByIdAndUserEmail(orderId, email)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }

    private String normalizePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            return PaymentMethod.COD;
        }

        String normalized = paymentMethod.trim().toUpperCase();
        if (PaymentMethod.COD.equals(normalized) || PaymentMethod.ONLINE.equals(normalized)) {
            return normalized;
        }

        throw new AppException(ErrorCode.INVALID_PAYMENT_METHOD);
    }

    private String resolveInitialOrderStatus(String paymentMethod) {
        if (PaymentMethod.ONLINE.equals(paymentMethod)) {
            return OrderStatus.PENDING_PAYMENT;
        }
        return OrderStatus.PENDING;
    }

    private String resolveInitialPaymentStatus(String paymentMethod) {
        if (PaymentMethod.ONLINE.equals(paymentMethod)) {
            return PaymentStatus.PENDING;
        }
        return PaymentStatus.UNPAID;
    }

    private OrderResponse toOrderResponse(Orders order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId().toString())
                        .bookId(item.getBook().getId().toString())
                        .title(item.getTitle())
                        .image(item.getImage())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .lineTotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId().toString())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .phone(order.getPhone())
                .address(order.getAddress())
                .latitude(order.getLatitude())
                .longitude(order.getLongitude())
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod() : PaymentMethod.COD)
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus() : PaymentStatus.UNPAID)
                .paymentReference(order.getPaymentReference())
                .createdAt(order.getCreatedAt())
                .paidAt(order.getPaidAt())
                .items(items)
                .build();
    }
}
