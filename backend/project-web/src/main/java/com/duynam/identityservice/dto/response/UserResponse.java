package com.duynam.identityservice.dto.response;

import java.time.LocalDate;
import java.util.Set;

import com.duynam.identityservice.constant.UserStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String email;
    String fullName;
    LocalDate dob;
    String phone;
    String address;
    String bio;
    Boolean twoFactorEnabled;
    UserStatus status;
    Set<RoleResponse> roles;
}

