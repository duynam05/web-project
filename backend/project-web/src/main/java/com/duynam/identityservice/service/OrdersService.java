package com.duynam.identityservice.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.identityservice.constant.OrderStatus;
import com.duynam.identityservice.constant.PaymentMethod;
import com.duynam.identityservice.constant.PaymentStatus;
import com.duynam.identityservice.dto.request.OrderPaymentRequest;
import com.duynam.identityservice.dto.request.OrderRequest;
import com.duynam.identityservice.dto.request.PayOsWebhookRequest;
import com.duynam.identityservice.dto.response.OrderItemResponse;
import com.duynam.identityservice.dto.response.OrderResponse;
import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.entity.CartItem;
import com.duynam.identityservice.entity.OrderItems;
import com.duynam.identityservice.entity.Orders;
import com.duynam.identityservice.entity.PaymentSession;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.repository.BookRepository;
import com.duynam.identityservice.repository.CartRepository;
import com.duynam.identityservice.repository.OrdersRepository;
import com.duynam.identityservice.repository.UserRepository;
import com.duynam.identityservice.validator.OrderValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private static final Logger log = LoggerFactory.getLogger(OrdersService.class);

    private final OrdersRepository ordersRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderValidator orderValidator;
    private final PaymentSessionService paymentSessionService;
    private final PayOsService payOsService;

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
        if (PaymentMethod.BANK_TRANSFER.equals(savedOrder.getPaymentMethod())
                && (savedOrder.getPaymentReference() == null || savedOrder.getPaymentReference().isBlank())) {
            savedOrder.setPaymentReference(buildBankTransferReference(savedOrder.getId()));
            savedOrder = ordersRepository.save(savedOrder);
            paymentSessionService.getOrCreateBankTransferSession(savedOrder);
        }

        cartRepository.deleteByUserEmail(email);
        return toOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(String email) {
        List<Orders> orders = ordersRepository.findByUserEmailOrderByCreatedAtDesc(email);
        Map<UUID, PaymentSession> latestSessions = paymentSessionService.findLatestByOrderIds(
                orders.stream().map(Orders::getId).toList());

        return orders.stream()
                .map(order -> toOrderResponse(order, latestSessions.get(order.getId())))
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        List<Orders> orders = ordersRepository.findAllByOrderByCreatedAtDesc();
        Map<UUID, PaymentSession> latestSessions = paymentSessionService.findLatestByOrderIds(
                orders.stream().map(Orders::getId).toList());

        return orders.stream()
                .map(order -> toOrderResponse(order, latestSessions.get(order.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String email, UUID orderId) {
        return toOrderResponse(findOrderForUser(email, orderId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdForAdmin(UUID orderId) {
        return toOrderResponse(findOrderForAdmin(orderId));
    }

    @Transactional
    public OrderResponse getPaymentSession(String email, UUID orderId) {
        Orders order = findOrderForUser(email, orderId);
        if (!PaymentMethod.BANK_TRANSFER.equals(order.getPaymentMethod())) {
            return toOrderResponse(order);
        }

        PaymentSession session = paymentSessionService.getOrCreateBankTransferSession(order);
        session = paymentSessionService.syncPaymentSession(order);
        return toOrderResponse(order, session);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public OrderResponse getPaymentSessionForAdmin(UUID orderId) {
        Orders order = findOrderForAdmin(orderId);
        if (!PaymentMethod.BANK_TRANSFER.equals(order.getPaymentMethod())) {
            return toOrderResponse(order);
        }

        PaymentSession session = paymentSessionService.getOrCreateBankTransferSession(order);
        session = paymentSessionService.syncPaymentSession(order);
        return toOrderResponse(order, session);
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
        order.setPaymentReference("PAY-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase(Locale.ROOT));
        order.setPaidAt(LocalDateTime.now());

        if (OrderStatus.PENDING.equals(order.getStatus()) || OrderStatus.PENDING_PAYMENT.equals(order.getStatus())) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        return toOrderResponse(ordersRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelOrder(String email, UUID orderId) {
        Orders order = findOrderForUser(email, orderId);
        syncBankTransferPaymentIfNeeded(order);

        if (!canCancelOrder(order.getStatus())) {
            throw new AppException(ErrorCode.ORDER_CANNOT_BE_CANCELLED);
        }

        for (OrderItems item : order.getItems()) {
            Book book = item.getBook();
            Integer currentStock = book.getStock() != null ? book.getStock() : 0;
            book.setStock(currentStock + item.getQuantity());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(resolveCancelledPaymentStatus(order.getPaymentStatus(), order.getPaymentMethod()));
        Orders savedOrder = ordersRepository.save(order);
        cancelPaymentSessionIfNeeded(savedOrder, "User cancelled order " + savedOrder.getId());

        return toOrderResponse(savedOrder);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public OrderResponse confirmBankTransferPayment(UUID orderId) {
        Orders order = findOrderForAdmin(orderId);

        if (PaymentStatus.PAID.equals(order.getPaymentStatus())) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        if (!PaymentMethod.BANK_TRANSFER.equals(order.getPaymentMethod())) {
            throw new AppException(ErrorCode.PAYMENT_METHOD_NOT_SUPPORTED);
        }

        if (OrderStatus.CANCELLED.equals(order.getStatus()) || OrderStatus.COMPLETED.equals(order.getStatus())) {
            throw new AppException(ErrorCode.ORDER_STATUS_TRANSITION_NOT_ALLOWED);
        }

        if (order.getPaymentReference() == null || order.getPaymentReference().isBlank()) {
            order.setPaymentReference(buildBankTransferReference(order.getId()));
        }

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaidAt(LocalDateTime.now());

        if (OrderStatus.PENDING.equals(order.getStatus()) || OrderStatus.PENDING_PAYMENT.equals(order.getStatus())) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        Orders savedOrder = ordersRepository.save(order);
        paymentSessionService.markSucceeded(savedOrder, "MANUAL-" + LocalDateTime.now().toString());
        return toOrderResponse(savedOrder);
    }

    @Transactional
    public boolean handlePayOsWebhook(PayOsWebhookRequest request) {
        if (request == null || request.getData() == null) {
            log.warn("payOS webhook ignored because payload or data is null");
            return false;
        }

        if (!payOsService.verifyWebhookSignature(request)) {
            log.warn("payOS webhook signature verification failed: orderCode={}, paymentLinkId={}",
                    request.getData().getOrderCode(),
                    request.getData().getPaymentLinkId());
            return false;
        }

        log.info("payOS webhook signature verified: orderCode={}, amount={}, reference={}",
                request.getData().getOrderCode(),
                request.getData().getAmount(),
                request.getData().getReference());

        PaymentSession session = paymentSessionService.findLatestByProviderOrderCode(request.getData().getOrderCode());
        if (session == null) {
            log.warn("payOS webhook could not find payment session for providerOrderCode={}",
                    request.getData().getOrderCode());
            return false;
        }

        Orders order = session.getOrder();
        log.info("payOS webhook matched payment session: sessionId={}, orderId={}, currentPaymentStatus={}, currentOrderStatus={}",
                session.getId(),
                order.getId(),
                order.getPaymentStatus(),
                order.getStatus());

        if (PaymentStatus.PAID.equals(order.getPaymentStatus())) {
            paymentSessionService.markSucceeded(session, request.getData());
            log.info("payOS webhook found order already marked as PAID: orderId={}", order.getId());
            return true;
        }

        order.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        if (request.getData().getReference() != null && !request.getData().getReference().isBlank()) {
            order.setPaymentReference(request.getData().getReference());
        }

        if (OrderStatus.PENDING.equals(order.getStatus()) || OrderStatus.PENDING_PAYMENT.equals(order.getStatus())) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        ordersRepository.save(order);
        paymentSessionService.markSucceeded(session, request.getData());
        log.info("payOS webhook updated order to PAID: orderId={}, paymentReference={}, providerReference={}",
                order.getId(),
                order.getPaymentReference(),
                request.getData().getReference());
        return true;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, String rawStatus) {
        Orders order = findOrderForAdmin(orderId);
        syncBankTransferPaymentIfNeeded(order);
        String nextStatus = parseOrderStatus(rawStatus);

        if (nextStatus.equals(order.getStatus())) {
            return toOrderResponse(order);
        }

        if (!isTransitionAllowed(order.getStatus(), nextStatus)) {
            throw new AppException(ErrorCode.ORDER_STATUS_TRANSITION_NOT_ALLOWED);
        }

        if (OrderStatus.CONFIRMED.equals(nextStatus)
                && PaymentMethod.BANK_TRANSFER.equals(order.getPaymentMethod())
                && !PaymentStatus.PAID.equals(order.getPaymentStatus())) {
            throw new AppException(ErrorCode.ORDER_STATUS_TRANSITION_NOT_ALLOWED);
        }

        if (OrderStatus.CANCELLED.equals(nextStatus)) {
            restoreStock(order);
            order.setPaymentStatus(resolveCancelledPaymentStatus(order.getPaymentStatus(), order.getPaymentMethod()));
        } else if (OrderStatus.COMPLETED.equals(nextStatus)
                && PaymentMethod.COD.equals(order.getPaymentMethod())
                && !PaymentStatus.PAID.equals(order.getPaymentStatus())) {
            order.setPaymentStatus(PaymentStatus.PAID);
            if (order.getPaidAt() == null) {
                order.setPaidAt(LocalDateTime.now());
            }
        }

        order.setStatus(nextStatus);
        Orders savedOrder = ordersRepository.save(order);
        if (OrderStatus.CANCELLED.equals(nextStatus)) {
            cancelPaymentSessionIfNeeded(savedOrder, "Admin cancelled order " + savedOrder.getId());
        }
        return toOrderResponse(savedOrder);
    }

    private Orders findOrderForUser(String email, UUID orderId) {
        return ordersRepository.findByIdAndUserEmail(orderId, email)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }

    private Orders findOrderForAdmin(UUID orderId) {
        return ordersRepository.findWithUserById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }

    private String normalizePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            return PaymentMethod.COD;
        }

        String normalized = paymentMethod.trim().toUpperCase(Locale.ROOT);
        if (PaymentMethod.COD.equals(normalized)
                || PaymentMethod.BANK_TRANSFER.equals(normalized)
                || PaymentMethod.ONLINE.equals(normalized)) {
            return normalized;
        }

        throw new AppException(ErrorCode.INVALID_PAYMENT_METHOD);
    }

    private String resolveInitialOrderStatus(String paymentMethod) {
        if (PaymentMethod.ONLINE.equals(paymentMethod) || PaymentMethod.BANK_TRANSFER.equals(paymentMethod)) {
            return OrderStatus.PENDING_PAYMENT;
        }
        return OrderStatus.PENDING;
    }

    private String resolveInitialPaymentStatus(String paymentMethod) {
        if (PaymentMethod.ONLINE.equals(paymentMethod) || PaymentMethod.BANK_TRANSFER.equals(paymentMethod)) {
            return PaymentStatus.PENDING;
        }
        return PaymentStatus.UNPAID;
    }

    private boolean canCancelOrder(String status) {
        return OrderStatus.PENDING.equals(status)
                || OrderStatus.PENDING_PAYMENT.equals(status)
                || OrderStatus.CONFIRMED.equals(status);
    }

    private String parseOrderStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        String normalized = rawStatus.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case OrderStatus.PENDING,
                    OrderStatus.PENDING_PAYMENT,
                    OrderStatus.CONFIRMED,
                    OrderStatus.SHIPPING,
                    OrderStatus.CANCELLED,
                    OrderStatus.COMPLETED -> normalized;
            default -> throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        };
    }

    private boolean isTransitionAllowed(String currentStatus, String nextStatus) {
        return switch (currentStatus) {
            case OrderStatus.PENDING -> OrderStatus.CONFIRMED.equals(nextStatus) || OrderStatus.CANCELLED.equals(nextStatus);
            case OrderStatus.PENDING_PAYMENT -> OrderStatus.CONFIRMED.equals(nextStatus) || OrderStatus.CANCELLED.equals(nextStatus);
            case OrderStatus.CONFIRMED -> OrderStatus.SHIPPING.equals(nextStatus) || OrderStatus.CANCELLED.equals(nextStatus);
            case OrderStatus.SHIPPING -> OrderStatus.COMPLETED.equals(nextStatus);
            case OrderStatus.CANCELLED, OrderStatus.COMPLETED -> false;
            default -> false;
        };
    }

    private void restoreStock(Orders order) {
        for (OrderItems item : order.getItems()) {
            Book book = item.getBook();
            Integer currentStock = book.getStock() != null ? book.getStock() : 0;
            book.setStock(currentStock + item.getQuantity());
        }
    }

    private String resolveCancelledPaymentStatus(String paymentStatus, String paymentMethod) {
        if (PaymentStatus.PAID.equals(paymentStatus)) {
            return PaymentStatus.REFUNDED;
        }

        if (PaymentMethod.ONLINE.equals(paymentMethod) || PaymentMethod.BANK_TRANSFER.equals(paymentMethod)) {
            return PaymentStatus.FAILED;
        }

        return PaymentStatus.UNPAID;
    }

    private String buildBankTransferReference(UUID orderId) {
        String normalized = orderId.toString().replace("-", "").toUpperCase(Locale.ROOT);
        return "DH-" + normalized.substring(0, 8);
    }

    private void syncBankTransferPaymentIfNeeded(Orders order) {
        if (order != null && PaymentMethod.BANK_TRANSFER.equals(order.getPaymentMethod())) {
            paymentSessionService.syncPaymentSession(order);
        }
    }

    private void cancelPaymentSessionIfNeeded(Orders order, String reason) {
        if (order == null
                || !PaymentMethod.BANK_TRANSFER.equals(order.getPaymentMethod())
                || PaymentStatus.PAID.equals(order.getPaymentStatus())
                || PaymentStatus.REFUNDED.equals(order.getPaymentStatus())) {
            return;
        }
        paymentSessionService.cancelSession(order, reason);
    }

    private OrderResponse toOrderResponse(Orders order) {
        return toOrderResponse(order, paymentSessionService.findLatestForOrder(order.getId()));
    }

    private OrderResponse toOrderResponse(Orders order, PaymentSession paymentSession) {
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
                .customerId(order.getUser() != null ? order.getUser().getId() : null)
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .customerName(order.getUser() != null ? order.getUser().getFullName() : null)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .phone(order.getPhone())
                .address(order.getAddress())
                .latitude(order.getLatitude())
                .longitude(order.getLongitude())
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod() : PaymentMethod.COD)
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus() : PaymentStatus.UNPAID)
                .paymentReference(order.getPaymentReference())
                .paymentSession(paymentSessionService.toResponse(paymentSession))
                .createdAt(order.getCreatedAt())
                .paidAt(order.getPaidAt())
                .items(items)
                .build();
    }
}
