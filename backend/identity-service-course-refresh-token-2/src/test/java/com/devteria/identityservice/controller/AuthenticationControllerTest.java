package com.devteria.identityservice.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

import com.devteria.identityservice.dto.request.AuthenticationRequest;
import com.devteria.identityservice.dto.response.AuthenticationResponse;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.service.AuthenticationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@WebMvcTest(AuthenticationController.class)
@TestPropertySource("/test.properties")
public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    private AuthenticationRequest request;

    @BeforeEach
    void initData() {
        request = AuthenticationRequest.builder()
                .email("john@example.com")
                .password("12345678")
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
}
