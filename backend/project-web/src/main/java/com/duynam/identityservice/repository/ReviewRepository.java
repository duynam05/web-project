package com.duynam.identityservice.repository;

import com.duynam.identityservice.constant.ReviewStatus;
import com.duynam.identityservice.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    @EntityGraph(attributePaths = {"book", "user"})
    List<Review> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"book", "user"})
    List<Review> findByBookIdAndStatusOrderByCreatedAtDesc(UUID bookId, ReviewStatus status);

    @EntityGraph(attributePaths = {"book", "user"})
    Optional<Review> findWithBookAndUserById(UUID id);
}
