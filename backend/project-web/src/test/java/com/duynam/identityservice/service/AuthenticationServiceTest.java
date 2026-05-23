package com.duynam.identityservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.duynam.identityservice.configuration.JwtProperties;
import com.duynam.identityservice.constant.UserStatus;
import com.duynam.identityservice.dto.request.AuthenticationRequest;
import com.duynam.identityservice.dto.response.AuthenticationResponse;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.repository.InvalidatedTokenRepository;
import com.duynam.identityservice.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private InvalidatedTokenRepository invalidatedTokenRepository;

    private PasswordEncoder passwordEncoder;
    private JwtProperties jwtProperties;

    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtProperties = new JwtProperties();
        jwtProperties.setSignerKey("0123456789012345678901234567890123456789012345678901234567890123");
        jwtProperties.setValidDuration(3600);
        jwtProperties.setRefreshableDuration(7200);

        authenticationService = new AuthenticationService(
                userRepository,
                invalidatedTokenRepository,
                passwordEncoder,
                jwtProperties
        );
    }

    @Test
    void authenticate_validCredentials_success() {
        User user = User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("12345678"))
                .status(UserStatus.ACTIVE)
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        AuthenticationResponse response = authenticationService.authenticate(AuthenticationRequest.builder()
                .email("john@example.com")
                .password("12345678")
                .build());

        assertThat(response.isAuthenticated()).isTrue();
        assertThat(response.getToken()).isNotBlank();
    }

    @Test
    void authenticate_unknownUser_fail() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> authenticationService.authenticate(AuthenticationRequest.builder()
                .email("missing@example.com")
                .password("12345678")
                .build()));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.USER_NOT_EXISTED);
    }

    @Test
    void authenticate_wrongPassword_fail() {
        User user = User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("12345678"))
                .status(UserStatus.ACTIVE)
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        AppException exception = assertThrows(AppException.class, () -> authenticationService.authenticate(AuthenticationRequest.builder()
                .email("john@example.com")
                .password("wrong-password")
                .build()));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.UNAUTHENTICATED);
    }

    @Test
    void authenticate_disabledAccount_fail() {
        User user = User.builder()
                .email("john@example.com")
                .password(passwordEncoder.encode("12345678"))
                .status(UserStatus.DISABLED)
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        AppException exception = assertThrows(AppException.class, () -> authenticationService.authenticate(AuthenticationRequest.builder()
                .email("john@example.com")
                .password("12345678")
                .build()));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ACCOUNT_DISABLED);
    }
}
