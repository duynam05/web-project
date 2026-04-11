package com.devteria.identityservice.validator;

import com.devteria.identityservice.dto.request.CartRequest;
import com.devteria.identityservice.repository.BookRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CartQuantityValidator implements ConstraintValidator<ValidCartQuantity, Integer> {

    private final BookRepository bookRepository;

    @Override
    public boolean isValid(Integer quantity, ConstraintValidatorContext context) {
        if (quantity == null || quantity <= 0) {
            return false;
        }

        try {
            HttpServletRequest request =
                    ((ServletRequestAttributes) RequestContextHolder
                            .getRequestAttributes())
                            .getRequest();

            Map<String, Object> body =
                    new ObjectMapper().readValue(request.getInputStream(), Map.class);

            String bookIdStr = (String) body.get("bookId");
            UUID bookId = UUID.fromString(bookIdStr);

            return bookRepository.findById(bookId)
                    .map(book -> quantity <= book.getStock())
                    .orElse(false);

        } catch (Exception e) {
            return false;
        }
    }
}