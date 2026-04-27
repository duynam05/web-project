package com.duynam.identityservice.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    UUID id;
    UUID bookId;
    String title;
    String author;
    String category;
    String image;
    String reviewerId;
    String reviewer;
    Integer rating;
    String content;
    String status;
    Boolean verifiedPurchase;
    String adminReply;
    LocalDateTime createdAt;
    LocalDateTime repliedAt;
}
