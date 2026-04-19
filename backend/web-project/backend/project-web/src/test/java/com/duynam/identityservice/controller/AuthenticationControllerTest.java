package com.duynam.identityservice.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

import com.duynam.identityservice.dto.request.AuthenticationRequest;
import com.duynam.identityservice.dto.request.RegisterRequest;
import com.duynam.identityservice.dto.response.AuthenticationResponse;
import com.duynam.identityservice.dto.response.UserResponse;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.service.AuthenticationService;
import com.duynam.identityservice.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(AuthenticationController.class)
@TestPropertySource("/test.properties")
public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private UserService userService;

    private AuthenticationRequest request;
    private RegisterRequest registerRequest;

    @BeforeEach
    void initData() {
        request = AuthenticationRequest.builder()
                .email("john@example.com")
                .password("12345678")
                .build();

        registerRequest = RegisterRequest.builder()
                .email("new-user@example.com")
                .password("12345678")
                .fullName("New User")
                .build();
    }

    @Test
    void authenticate_validRequest_success() throws Exception {
        var response = AuthenticationResponse.builder()
                .token("dummy-token")
                .authenticated(true)
                .build();

        when(authenticationService.authenticate(any())).thenReturn(response);

        ObjectMapper objectMapper = new ObjectMapper();
        String content = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/auth/token")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value(1000))
                .andExpect(jsonPath("result.token").value("dummy-token"))
                .andExpect(jsonPath("result.authenticated").value(true));
    }

    @Test
    void authenticate_invalidCredentials_unauthenticated() throws Exception {
        when(authenticationService.authenticate(any()))
                .thenThrow(new AppException(ErrorCode.UNAUTHENTICATED));

        ObjectMapper objectMapper = new ObjectMapper();
        String content = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/auth/token")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("code").value(ErrorCode.UNAUTHENTICATED.getCode()))
                .andExpect(jsonPath("message").value(ErrorCode.UNAUTHENTICATED.getMessage()));
    }

    @Test
    void register_validRequest_success() throws Exception {
        var response = UserResponse.builder()
                .id("new-user-id")
                .email("new-user@example.com")
                .fullName("New User")
                .build();

        when(userService.registerUser(any())).thenReturn(response);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String content = objectMapper.writeValueAsString(registerRequest);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value(1000))
                .andExpect(jsonPath("result.id").value("new-user-id"))
                .andExpect(jsonPath("result.email").value("new-user@example.com"));
    }
}

