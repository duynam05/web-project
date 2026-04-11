package com.devteria.identityservice.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = CartQuantityValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ValidCartQuantity {

    String message() default "Quantity exceeds available stock";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}