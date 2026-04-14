package com.duynam.identityservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    @NotBlank(message = "INVALID_CURRENT_PASSWORD")
    String currentPassword;

    @NotBlank(message = "INVALID_NEW_PASSWORD")
    @Size(min = 6, message = "INVALID_NEW_PASSWORD")
    String newPassword;
}

