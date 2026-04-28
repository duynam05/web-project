package com.duynam.identityservice.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewReplyResponse {
    UUID id;
    String userId;
    String userName;
    UUID parentReplyId;
    String content;
    LocalDateTime createdAt;
    List<ReviewReplyResponse> replies;
}
