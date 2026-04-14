package com.duynam.identityservice.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;

import com.duynam.identityservice.constant.PredefinedRole;
import com.duynam.identityservice.constant.UserStatus;
import com.duynam.identityservice.dto.request.ChangePasswordRequest;
import com.duynam.identityservice.dto.request.UserCreationRequest;
import com.duynam.identityservice.dto.response.UserResponse;
import com.duynam.identityservice.entity.Role;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.repository.RoleRepository;
import com.duynam.identityservice.repository.UserRepository;

@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@TestPropertySource("/test.properties")
public class UserServiceTest {
    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private UserCreationRequest request;
    private UserResponse userResponse;
    private User user;
    private Role userRole;
    private LocalDate dob;

    @BeforeEach
    void initData() {
        dob = LocalDate.of(1990, 1, 1);

        request = UserCreationRequest.builder()
                .email("john@example.com")
                .fullName("John Doe")
                .password("12345678")
                .dob(dob)
                .build();

        userResponse = UserResponse.builder()
                .id("cf0600f538b3")
                .email("john@example.com")
                .fullName("John Doe")
                .dob(dob)
                .build();

        user = User.builder()
                .id("cf0600f538b3")
                .email("john@example.com")
                .fullName("John Doe")
                .status(UserStatus.ACTIVE)
                .build();

        userRole = Role.builder().name(PredefinedRole.USER_ROLE).description("User role").build();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_validRequest_success() {
        // GIVEN
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findById(PredefinedRole.USER_ROLE)).thenReturn(Optional.of(userRole));
        when(userRepository.save(any())).thenReturn(user);

        // WHEN
        var response = userService.createUser(request);
        // THEN

        Assertions.assertThat(response.getId()).isEqualTo("cf0600f538b3");
        Assertions.assertThat(response.getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_userExisted_fail() {
        // GIVEN
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // WHEN
        var exception = assertThrows(AppException.class, () -> userService.createUser(request));

        // THEN
        Assertions.assertThat(exception.getErrorCode().getCode()).isEqualTo(1002);
    }

    @Test
    @WithMockUser(username = "john@example.com")
    void getMyInfo_valid_success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        var response = userService.getMyInfo();

        Assertions.assertThat(response.getEmail()).isEqualTo("john@example.com");
        Assertions.assertThat(response.getId()).isEqualTo("cf0600f538b3");
    }

    @Test
    @WithMockUser(username = "john@example.com")
    void getMyInfo_userNotFound_error() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.ofNullable(null));

        // WHEN
        var exception = assertThrows(AppException.class, () -> userService.getMyInfo());

        Assertions.assertThat(exception.getErrorCode().getCode()).isEqualTo(1005);
    }

    @Test
    @WithMockUser(username = "john@example.com")
    void changePassword_validCurrentPassword_success() {
        user.setPassword(passwordEncoder.encode("12345678"));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        userService.changePassword(ChangePasswordRequest.builder()
                .currentPassword("12345678")
                .newPassword("87654321")
                .build());

        Assertions.assertThat(passwordEncoder.matches("87654321", user.getPassword())).isTrue();
    }

    @Test
    @WithMockUser(username = "john@example.com")
    void changePassword_invalidCurrentPassword_fail() {
        user.setPassword(passwordEncoder.encode("12345678"));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        var exception = assertThrows(AppException.class, () -> userService.changePassword(ChangePasswordRequest.builder()
                .currentPassword("wrong-password")
                .newPassword("87654321")
                .build()));

        Assertions.assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_CURRENT_PASSWORD);
    }
}

