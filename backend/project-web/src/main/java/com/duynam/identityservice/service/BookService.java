package com.duynam.identityservice.service;

import com.duynam.identityservice.dto.response.BookPageResponse;
import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.repository.BookRepository;
import com.duynam.identityservice.repository.specification.BookSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public BookPageResponse getBooks(String keyword, String category, String sortBy, int page, int size) {
        int normalizedPage = Math.max(page, 0);
        int normalizedSize = Math.min(Math.max(size, 1), 100);

        Specification<Book> specification = Specification
                .where(BookSpecifications.titleOrAuthorContains(keyword))
                .and(BookSpecifications.categoryEquals(category));

        PageRequest pageRequest = PageRequest.of(normalizedPage, normalizedSize, resolveSort(sortBy));

        return BookPageResponse.fromPage(bookRepository.findAll(specification, pageRequest));
    }

    public Book getById(UUID id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
    }

    public Book create(Book book) {
        return bookRepository.save(book);
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null || sortBy.isBlank() || "popular".equalsIgnoreCase(sortBy)) {
            return Sort.by(
                    Sort.Order.desc("rating"),
                    Sort.Order.asc("title")
            );
        }

        return switch (sortBy.toLowerCase()) {
            case "rating" -> Sort.by(
                    Sort.Order.desc("rating"),
                    Sort.Order.asc("title")
            );
            case "price_asc" -> Sort.by(
                    Sort.Order.asc("price"),
                    Sort.Order.asc("title")
            );
            case "price_desc" -> Sort.by(
                    Sort.Order.desc("price"),
                    Sort.Order.asc("title")
            );
            case "title_asc" -> Sort.by(Sort.Order.asc("title"));
            case "title_desc" -> Sort.by(Sort.Order.desc("title"));
            default -> Sort.by(
                    Sort.Order.desc("rating"),
                    Sort.Order.asc("title")
            );
        };
    }
}
