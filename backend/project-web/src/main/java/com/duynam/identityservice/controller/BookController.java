package com.duynam.identityservice.controller;

import com.duynam.identityservice.dto.request.ApiResponse;
import com.duynam.identityservice.dto.response.ImageUploadResponse;
import com.duynam.identityservice.entity.Book;
import com.duynam.identityservice.service.BookService;
import com.duynam.identityservice.service.CloudinaryImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookController {

    private final BookService bookService;
    private final CloudinaryImageService cloudinaryImageService;

    @GetMapping
    public List<Book> getAll() {
        return bookService.getAll();
    }

    @PostMapping
    public Book create(@RequestBody Book book) {
        return bookService.create(book);
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ImageUploadResponse> uploadImage(@RequestPart("file") MultipartFile file) {
        return ApiResponse.<ImageUploadResponse>builder()
                .result(cloudinaryImageService.uploadBookImage(file))
                .build();
    }
}

