package com.duynam.identityservice.repository;

import com.duynam.identityservice.entity.ReviewReply;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewReplyRepository extends JpaRepository<ReviewReply, UUID> {
    @EntityGraph(attributePaths = {"user", "parentReply"})
    List<ReviewReply> findByReviewIdOrderByCreatedAtAsc(UUID reviewId);

    @EntityGraph(attributePaths = {"user", "parentReply", "review"})
    Optional<ReviewReply> findWithUserAndReviewById(UUID id);
}
