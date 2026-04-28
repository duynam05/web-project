package com.duynam.identityservice.service;

import com.duynam.identityservice.constant.OrderStatus;
import com.duynam.identityservice.constant.ReviewStatus;
import com.duynam.identityservice.dto.request.ReviewCreateRequest;
import com.duynam.identityservice.dto.request.ReviewReplyRequest;
import com.duynam.identityservice.dto.request.ReviewUserReplyRequest;
import com.duynam.identityservice.dto.response.ReviewResponse;
import com.duynam.identityservice.dto.response.ReviewReplyResponse;
import com.duynam.identityservice.dto.response.ReviewSummaryResponse;
import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.entity.OrderItems;
import com.duynam.identityservice.entity.Orders;
import com.duynam.identityservice.entity.Review;
import com.duynam.identityservice.entity.ReviewReply;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.repository.OrdersRepository;
import com.duynam.identityservice.repository.ReviewRepository;
import com.duynam.identityservice.repository.ReviewReplyRepository;
import com.duynam.identityservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewReplyRepository reviewReplyRepository;
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

    public ReviewResponse updateOwnReview(UUID bookId, UUID reviewId, String email, ReviewCreateRequest request) {
        Review review = getOwnedReview(bookId, reviewId, email);
        review.setRating(request.getRating());
        review.setContent(request.getContent().trim());
        return toResponse(reviewRepository.save(review));
    }

    public void deleteOwnReview(UUID bookId, UUID reviewId, String email) {
        Review review = getOwnedReview(bookId, reviewId, email);
        reviewRepository.delete(review);
    }

    public ReviewResponse replyOwnReview(UUID bookId, UUID reviewId, String email, ReviewUserReplyRequest request) {
        Review review = getReview(reviewId);
        if (!Objects.equals(review.getBook().getId(), bookId)) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ReviewReply parentReply = null;
        if (request.getParentReplyId() != null) {
            parentReply = getReply(request.getParentReplyId());
            if (!Objects.equals(parentReply.getReview().getId(), reviewId)) {
                throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
            }
        }

        ReviewReply reply = ReviewReply.builder()
                .review(review)
                .parentReply(parentReply)
                .user(user)
                .content(request.getReply().trim())
                .build();
        reviewReplyRepository.save(reply);

        return toResponse(review);
    }

    public ReviewResponse updateOwnReply(UUID bookId, UUID reviewId, UUID replyId, String email, ReviewUserReplyRequest request) {
        ReviewReply reply = getOwnedReply(bookId, reviewId, replyId, email);
        reply.setContent(request.getReply().trim());
        reviewReplyRepository.save(reply);
        return toResponse(reply.getReview());
    }

    public ReviewResponse deleteOwnReply(UUID bookId, UUID reviewId, UUID replyId, String email) {
        ReviewReply reply = getOwnedReply(bookId, reviewId, replyId, email);
        Review review = reply.getReview();
        reviewReplyRepository.delete(reply);
        return toResponse(review);
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

    @PreAuthorize("hasRole('ADMIN')")
    public ReviewResponse replyToDiscussionAsAdmin(UUID reviewId, String email, ReviewUserReplyRequest request) {
        Review review = getReview(reviewId);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ReviewReply parentReply = null;
        if (request.getParentReplyId() != null) {
            parentReply = getReply(request.getParentReplyId());
            if (!Objects.equals(parentReply.getReview().getId(), reviewId)) {
                throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
            }
        }

        reviewReplyRepository.save(ReviewReply.builder()
                .review(review)
                .parentReply(parentReply)
                .user(user)
                .content(request.getReply().trim())
                .build());

        return toResponse(review);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ReviewResponse deleteReplyAsAdmin(UUID reviewId, UUID replyId) {
        ReviewReply reply = getReply(replyId);
        if (!Objects.equals(reply.getReview().getId(), reviewId)) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        Review review = reply.getReview();
        reviewReplyRepository.delete(reply);
        return toResponse(review);
    }

    private Review getReview(UUID reviewId) {
        return reviewRepository.findWithBookAndUserById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
    }

    private Review getOwnedReview(UUID bookId, UUID reviewId, String email) {
        Review review = getReview(reviewId);
        if (!Objects.equals(review.getBook().getId(), bookId)) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }
        if (review.getUser() == null || !Objects.equals(review.getUser().getEmail(), email)) {
            throw new AppException(ErrorCode.REVIEW_PERMISSION_DENIED);
        }
        return review;
    }

    private ReviewReply getReply(UUID replyId) {
        return reviewReplyRepository.findWithUserAndReviewById(replyId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
    }

    private ReviewReply getOwnedReply(UUID bookId, UUID reviewId, UUID replyId, String email) {
        ReviewReply reply = getReply(replyId);
        if (!Objects.equals(reply.getReview().getId(), reviewId)
                || !Objects.equals(reply.getReview().getBook().getId(), bookId)) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }
        if (reply.getUser() == null || !Objects.equals(reply.getUser().getEmail(), email)) {
            throw new AppException(ErrorCode.REVIEW_PERMISSION_DENIED);
        }
        return reply;
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
                .customerReply(review.getCustomerReply())
                .replies(buildReplyTree(reviewReplyRepository.findByReviewIdOrderByCreatedAtAsc(review.getId())))
                .createdAt(review.getCreatedAt())
                .repliedAt(review.getRepliedAt())
                .customerRepliedAt(review.getCustomerRepliedAt())
                .build();
    }

    private ReviewReplyResponse toReplyResponse(ReviewReply reply) {
        String userName = reply.getUser().getFullName();
        if (userName == null || userName.isBlank()) {
            userName = reply.getUser().getEmail();
        }

        return ReviewReplyResponse.builder()
                .id(reply.getId())
                .userId(reply.getUser().getId())
                .userName(userName)
                .parentReplyId(reply.getParentReply() != null ? reply.getParentReply().getId() : null)
                .content(reply.getContent())
                .createdAt(reply.getCreatedAt())
                .replies(new ArrayList<>())
                .build();
    }

    private List<ReviewReplyResponse> buildReplyTree(List<ReviewReply> replies) {
        Map<UUID, ReviewReplyResponse> byId = new LinkedHashMap<>();
        List<ReviewReplyResponse> roots = new ArrayList<>();

        for (ReviewReply reply : replies) {
            byId.put(reply.getId(), toReplyResponse(reply));
        }

        for (ReviewReply reply : replies) {
            ReviewReplyResponse current = byId.get(reply.getId());
            UUID parentId = reply.getParentReply() != null ? reply.getParentReply().getId() : null;
            if (parentId == null) {
                roots.add(current);
                continue;
            }

            ReviewReplyResponse parent = byId.get(parentId);
            if (parent == null) {
                roots.add(current);
                continue;
            }
            parent.getReplies().add(current);
        }

        return roots;
    }
}
