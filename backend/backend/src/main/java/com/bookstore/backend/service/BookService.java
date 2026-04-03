package com.bookstore.backend.service;

import com.bookstore.backend.entity.Book;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    public List<Book> getAll() {
        return repo.findAll();
    }

    public Book getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Book create(Book book) {
        return repo.save(book);
    }

    public Book update(Long id, Book newBook) {
        Book book = repo.findById(id).orElseThrow();
        book.setTitle(newBook.getTitle());
        book.setAuthor(newBook.getAuthor());
        book.setPrice(newBook.getPrice());
        book.setImage(newBook.getImage());
        book.setDescription(newBook.getDescription());
        book.setCategory(newBook.getCategory());
        return repo.save(book);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
