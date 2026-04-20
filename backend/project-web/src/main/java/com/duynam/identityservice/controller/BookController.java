package com.duynam.identityservice.controller;

import com.duynam.identityservice.dto.request.ApiResponse;
import com.duynam.identityservice.dto.response.BookPageResponse;
import com.duynam.identityservice.dto.response.ImageUploadResponse;
import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.service.BookService;
import com.duynam.identityservice.service.CloudinaryImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookController {

    private final BookService bookService;
    private final CloudinaryImageService cloudinaryImageService;

    @GetMapping
    public ApiResponse<BookPageResponse> getAll(
            @RequestParam(value = "q", required = false) String keyword,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "sort", defaultValue = "popular") String sortBy,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size
    ) {
        return ApiResponse.<BookPageResponse>builder()
                .result(bookService.getBooks(keyword, category, sortBy, page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Book> getById(@PathVariable UUID id) {
        return ApiResponse.<Book>builder()
                .result(bookService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Book create(@RequestBody Book book) {
        return bookService.create(book);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Book update(@PathVariable UUID id, @RequestBody Book book) {
        return bookService.update(id, book);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        bookService.delete(id);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ImageUploadResponse> uploadImage(@RequestPart("file") MultipartFile file) {
        return ApiResponse.<ImageUploadResponse>builder()
                .result(cloudinaryImageService.uploadBookImage(file))
                .build();
    }
}
