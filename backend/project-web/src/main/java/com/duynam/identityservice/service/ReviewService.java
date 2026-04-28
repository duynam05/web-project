package com.duynam.identityservice.service;

import com.duynam.identityservice.constant.OrderStatus;
import com.duynam.identityservice.constant.ReviewStatus;
import com.duynam.identityservice.dto.request.ReviewCreateRequest;
import com.duynam.identityservice.dto.request.ReviewReplyRequest;
import com.duynam.identityservice.dto.response.ReviewResponse;
import com.duynam.identityservice.dto.response.ReviewSummaryResponse;
import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.entity.OrderItems;
import com.duynam.identityservice.entity.Orders;
import com.duynam.identityservice.entity.Review;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.repository.OrdersRepository;
import com.duynam.identityservice.repository.ReviewRepository;
import com.duynam.identityservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookService bookService;
    private final UserRepository userRepository;
    private final OrdersRepository ordersRepository;

    public List<ReviewResponse> getApprovedReviewsByBook(UUID bookId) {
        return reviewRepository.findByBookIdAndStatusOrderByCreatedAtDesc(bookId, ReviewStatus.APPROVED).stream()
                .map(this::toResponse)
                .toList();
    }

    public ReviewResponse createReview(UUID bookId, String email, ReviewCreateRequest request) {
        Book book = bookService.getById(bookId);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (reviewRepository.existsByBookIdAndUserId(bookId, user.getId())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        Review review = Review.builder()
                .book(book)
                .user(user)
                .rating(request.getRating())
                .content(request.getContent().trim())
                .status(ReviewStatus.APPROVED)
                .verifiedPurchase(hasVerifiedPurchase(user.getId(), bookId))
                .build();

        return toResponse(reviewRepository.save(review));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<ReviewResponse> getAllReviews(String search, String status) {
        ReviewStatus parsedStatus = parseStatus(status, false);

        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(review -> parsedStatus == null || review.getStatus() == parsedStatus)
                .filter(review -> matchesSearch(review, search))
                .map(this::toResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ReviewSummaryResponse getSummary() {
        List<Review> reviews = reviewRepository.findAll();
        long totalReviews = reviews.size();
        long pendingReviews = reviews.stream()
                .filter(review -> review.getStatus() == ReviewStatus.PENDING)
                .count();
        long repliedReviews = reviews.stream()
                .filter(review -> review.getAdminReply() != null && !review.getAdminReply().isBlank())
                .count();

        double averageRating = totalReviews == 0
                ? 0
                : reviews.stream().mapToInt(Review::getRating).average().orElse(0);

        int responseRate = totalReviews == 0
                ? 0
                : (int) Math.round((repliedReviews * 100.0) / totalReviews);

        return ReviewSummaryResponse.builder()
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .pendingReviews(pendingReviews)
                .responseRate(responseRate)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ReviewResponse updateStatus(UUID reviewId, String rawStatus) {
        Review review = getReview(reviewId);
        review.setStatus(parseStatus(rawStatus, true));
        return toResponse(reviewRepository.save(review));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ReviewResponse reply(UUID reviewId, ReviewReplyRequest request) {
        Review review = getReview(reviewId);
        review.setAdminReply(request.getReply().trim());
        review.setRepliedAt(LocalDateTime.now());
        if (review.getStatus() == ReviewStatus.PENDING) {
            review.setStatus(ReviewStatus.APPROVED);
        }
        return toResponse(reviewRepository.save(review));
    }

    private Review getReview(UUID reviewId) {
        return reviewRepository.findWithBookAndUserById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
    }

    private boolean matchesSearch(Review review, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }

        String normalized = search.trim().toLowerCase(Locale.ROOT);
        return contains(review.getBook().getTitle(), normalized)
                || contains(review.getBook().getAuthor(), normalized)
                || contains(review.getBook().getCategory(), normalized)
                || contains(review.getUser().getFullName(), normalized)
                || contains(review.getUser().getEmail(), normalized)
                || contains(review.getContent(), normalized);
    }

    private boolean contains(String value, String search) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(search);
    }

    private ReviewStatus parseStatus(String rawStatus, boolean required) {
        if (rawStatus == null || rawStatus.isBlank()) {
            if (required) {
                throw new AppException(ErrorCode.INVALID_REVIEW_STATUS);
            }
            return null;
        }

        try {
            return ReviewStatus.valueOf(rawStatus.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new AppException(ErrorCode.INVALID_REVIEW_STATUS);
        }
    }

    private boolean hasVerifiedPurchase(String userId, UUID bookId) {
        return ordersRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(order -> order.getUser() != null && userId.equals(order.getUser().getId()))
                .filter(this::isCompletedOrder)
                .flatMap(order -> order.getItems().stream())
                .map(OrderItems::getBook)
                .anyMatch(book -> book != null && bookId.equals(book.getId()));
    }

    private boolean isCompletedOrder(Orders order) {
        return OrderStatus.COMPLETED.equalsIgnoreCase(order.getStatus())
                || OrderStatus.CONFIRMED.equalsIgnoreCase(order.getStatus())
                || OrderStatus.SHIPPING.equalsIgnoreCase(order.getStatus());
    }

    private ReviewResponse toResponse(Review review) {
        String reviewerName = review.getUser().getFullName();
        if (reviewerName == null || reviewerName.isBlank()) {
            reviewerName = review.getUser().getEmail();
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .bookId(review.getBook().getId())
                .title(review.getBook().getTitle())
                .author(review.getBook().getAuthor())
                .category(review.getBook().getCategory())
                .image(review.getBook().getImage())
                .reviewerId(review.getUser().getId())
                .reviewer(reviewerName)
                .rating(review.getRating())
                .content(review.getContent())
                .status(review.getStatus().name())
                .verifiedPurchase(Boolean.TRUE.equals(review.getVerifiedPurchase()))
                .adminReply(review.getAdminReply())
                .createdAt(review.getCreatedAt())
                .repliedAt(review.getRepliedAt())
                .build();
    }
}
