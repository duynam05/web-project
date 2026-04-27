package com.duynam.identityservice.controller;

import com.duynam.identityservice.dto.request.ApiResponse;
import com.duynam.identityservice.dto.request.ReviewCreateRequest;
import com.duynam.identityservice.dto.request.ReviewReplyRequest;
import com.duynam.identityservice.dto.request.ReviewStatusUpdateRequest;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
