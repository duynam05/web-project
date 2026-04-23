package com.duynam.identityservice.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.identityservice.dto.request.CartRequest;
import com.duynam.identityservice.dto.response.CartItemResponse;
import com.duynam.identityservice.dto.response.CartResponse;
import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.entity.CartItem;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.repository.BookRepository;
import com.duynam.identityservice.repository.CartRepository;
import com.duynam.identityservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        return buildCartResponse(email);
    }

    @Transactional
    public CartResponse addToCart(String email, CartRequest request) {
        User user = findUserByEmail(email);
        Book book = findBookById(request.getBookId());
        validateQuantity(request.getQuantity(), book.getStock());

        Optional<CartItem> existing = cartRepository.findByUserAndBook(user, book);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            validateQuantity(newQuantity, book.getStock());

            item.setQuantity(newQuantity);
            cartRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .user(user)
                    .book(book)
                    .quantity(request.getQuantity())
                    .price(book.getPrice())
                    .title(book.getTitle())
                    .image(book.getImage())
                    .build();

            cartRepository.save(item);
        }

        return buildCartResponse(email);
    }

    @Transactional
    public CartResponse deleteItem(String email, UUID id) {
        long deleted = cartRepository.deleteByIdAndUserEmail(id, email);
        if (deleted == 0) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        return buildCartResponse(email);
    }

    @Transactional
    public CartResponse updateQuantity(String email, UUID id, int quantity) {
        CartItem item = cartRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        validateQuantity(quantity, item.getBook().getStock());
        item.setQuantity(quantity);
        cartRepository.save(item);

        return buildCartResponse(email);
    }

    @Transactional
    public CartResponse clearCart(String email) {
        cartRepository.deleteByUserEmail(email);
        return buildCartResponse(email);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private Book findBookById(UUID bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
    }

    private void validateQuantity(int quantity, Integer stock) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        if (stock == null || quantity > stock) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
    }

    private CartResponse buildCartResponse(String email) {
        List<CartItemResponse> items = cartRepository.findAllByUserEmailOrderByIdAsc(email).stream()
                .map(this::toCartItemResponse)
                .toList();

        BigDecimal totalPrice = items.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalQuantity = items.stream().mapToInt(CartItemResponse::getQuantity).sum();

        return CartResponse.builder()
                .items(items)
                .totalItems(items.size())
                .totalQuantity(totalQuantity)
                .totalPrice(totalPrice)
                .build();
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .id(item.getId())
                .bookId(item.getBook().getId())
                .title(item.getTitle())
                .image(item.getImage())
                .unitPrice(item.getPrice())
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .availableStock(item.getBook().getStock())
                .build();
    }
}

