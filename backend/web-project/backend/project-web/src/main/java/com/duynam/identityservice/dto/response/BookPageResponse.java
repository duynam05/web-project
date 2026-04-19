package com.duynam.identityservice.dto.response;

import com.duynam.identityservice.entity.Book;
import lombok.Builder;
import lombok.Value;
import org.springframework.data.domain.Page;

import java.util.List;

@Value
@Builder
public class BookPageResponse {
    List<Book> content;
    int page;
    int size;
    long totalElements;
    int totalPages;

    public static BookPageResponse fromPage(Page<Book> page) {
        return BookPageResponse.builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
