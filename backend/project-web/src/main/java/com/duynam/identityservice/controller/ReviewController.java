package com.duynam.identityservice.controller;

import com.duynam.identityservice.dto.request.ApiResponse;
import com.duynam.identityservice.dto.request.ReviewCreateRequest;
import com.duynam.identityservice.dto.request.ReviewReplyRequest;
import com.duynam.identityservice.dto.request.ReviewStatusUpdateRequest;
import com.duynam.identityservice.dto.request.ReviewUserReplyRequest;
import com.duynam.identityservice.dto.response.ReviewResponse;
import com.duynam.identityservice.dto.response.ReviewSummaryResponse;
import com.duynam.identityservice.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/books/{bookId}/reviews")
    public ApiResponse<List<ReviewResponse>> getApprovedReviewsByBook(@PathVariable UUID bookId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getApprovedReviewsByBook(bookId))
                .build();
    }

    @PostMapping("/books/{bookId}/reviews")
    public ApiResponse<ReviewResponse> createReview(
            @PathVariable UUID bookId,
            @RequestBody @Valid ReviewCreateRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(bookId, authentication.getName(), request))
                .build();
    }

    @PutMapping("/books/{bookId}/reviews/{reviewId}")
    public ApiResponse<ReviewResponse> updateOwnReview(
            @PathVariable UUID bookId,
            @PathVariable UUID reviewId,
            @RequestBody @Valid ReviewCreateRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.updateOwnReview(bookId, reviewId, authentication.getName(), request))
                .build();
    }

    @DeleteMapping("/books/{bookId}/reviews/{reviewId}")
    public ApiResponse<Void> deleteOwnReview(
            @PathVariable UUID bookId,
            @PathVariable UUID reviewId,
            Authentication authentication) {
        reviewService.deleteOwnReview(bookId, reviewId, authentication.getName());
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/books/{bookId}/reviews/{reviewId}/reply")
    public ApiResponse<ReviewResponse> replyOwnReview(
            @PathVariable UUID bookId,
            @PathVariable UUID reviewId,
            @RequestBody @Valid ReviewUserReplyRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.replyOwnReview(bookId, reviewId, authentication.getName(), request))
                .build();
    }

    @PutMapping("/books/{bookId}/reviews/{reviewId}/replies/{replyId}")
    public ApiResponse<ReviewResponse> updateOwnReply(
            @PathVariable UUID bookId,
            @PathVariable UUID reviewId,
            @PathVariable UUID replyId,
            @RequestBody @Valid ReviewUserReplyRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.updateOwnReply(bookId, reviewId, replyId, authentication.getName(), request))
                .build();
    }

    @DeleteMapping("/books/{bookId}/reviews/{reviewId}/replies/{replyId}")
    public ApiResponse<ReviewResponse> deleteOwnReply(
            @PathVariable UUID bookId,
            @PathVariable UUID reviewId,
            @PathVariable UUID replyId,
            Authentication authentication) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.deleteOwnReply(bookId, reviewId, replyId, authentication.getName()))
                .build();
    }

    @GetMapping("/admin/reviews")
    public ApiResponse<List<ReviewResponse>> getAllReviews(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String status) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getAllReviews(search, status))
                .build();
    }

    @GetMapping("/admin/reviews/summary")
    public ApiResponse<ReviewSummaryResponse> getSummary() {
        return ApiResponse.<ReviewSummaryResponse>builder()
                .result(reviewService.getSummary())
                .build();
    }

    @PatchMapping("/admin/reviews/{reviewId}/status")
    public ApiResponse<ReviewResponse> updateStatus(
            @PathVariable UUID reviewId,
            @RequestBody @Valid ReviewStatusUpdateRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.updateStatus(reviewId, request.getStatus()))
                .build();
    }

    @PostMapping("/admin/reviews/{reviewId}/reply")
    public ApiResponse<ReviewResponse> reply(
            @PathVariable UUID reviewId,
            @RequestBody @Valid ReviewReplyRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.reply(reviewId, request))
                .build();
    }

    @PostMapping("/admin/reviews/{reviewId}/discussion-replies")
    public ApiResponse<ReviewResponse> replyToDiscussion(
            @PathVariable UUID reviewId,
            @RequestBody @Valid ReviewUserReplyRequest request,
            Authentication authentication) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.replyToDiscussionAsAdmin(reviewId, authentication.getName(), request))
                .build();
    }

    @DeleteMapping("/admin/reviews/{reviewId}/discussion-replies/{replyId}")
    public ApiResponse<ReviewResponse> deleteDiscussionReply(
            @PathVariable UUID reviewId,
            @PathVariable UUID replyId) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.deleteReplyAsAdmin(reviewId, replyId))
                .build();
    }

}
