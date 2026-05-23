package com.duynam.identityservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.duynam.identityservice.constant.PredefinedRole;
import com.duynam.identityservice.constant.UserStatus;
import com.duynam.identityservice.dto.request.RegisterRequest;
import com.duynam.identityservice.dto.response.UserResponse;
import com.duynam.identityservice.entity.Role;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.mapper.UserMapper;
import com.duynam.identityservice.repository.RoleRepository;
import com.duynam.identityservice.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserRegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userMapper = Mappers.getMapper(UserMapper.class);
        passwordEncoder = new BCryptPasswordEncoder();
        userService = new UserService(userRepository, roleRepository, userMapper, passwordEncoder);
    }

    @Test
    void registerUser_shouldCreateActiveUserWithDefaultRole() {
        RegisterRequest request = RegisterRequest.builder()
                .email("new-user@example.com")
                .password("12345678")
                .fullName("New User")
                .build();

        Role defaultRole = Role.builder().name(PredefinedRole.USER_ROLE).build();

        when(userRepository.existsByEmail("new-user@example.com")).thenReturn(false);
        when(roleRepository.findById(PredefinedRole.USER_ROLE)).thenReturn(Optional.of(defaultRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId("user-1");
            return saved;
        });

        UserResponse response = userService.registerUser(request);

        assertThat(response.getId()).isEqualTo("user-1");
        assertThat(response.getEmail()).isEqualTo("new-user@example.com");
        assertThat(response.getFullName()).isEqualTo("New User");
    }

    @Test
    void registerUser_shouldRejectDuplicateEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .email("new-user@example.com")
                .password("12345678")
                .fullName("New User")
                .build();

        when(userRepository.existsByEmail("new-user@example.com")).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> userService.registerUser(request));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.USER_EXISTED);
    }
}
