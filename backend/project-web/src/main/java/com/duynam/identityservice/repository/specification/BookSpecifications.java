package com.duynam.identityservice.repository.specification;

import com.duynam.identityservice.entity.Book;
import org.springframework.data.jpa.domain.Specification;

public final class BookSpecifications {

    private BookSpecifications() {
    }

    public static Specification<Book> titleOrAuthorContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String normalizedKeyword = "%" + keyword.trim().toLowerCase() + "%";

            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), normalizedKeyword),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), normalizedKeyword)
            );
        };
    }

    public static Specification<Book> categoryEquals(String category) {
        return (root, query, criteriaBuilder) -> {
            if (category == null || category.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.trim().toLowerCase());
        };
    }
}
