package com.devteria.identityservice.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;

import com.devteria.identityservice.validator.DobConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 4, message = "EMAIL_INVALID")
    String email;

    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    String fullName;

    @DobConstraint(min = 10, message = "INVALID_DOB")
    LocalDate dob;
}
