package com.duynam.identityservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.identityservice.dto.request.ApiResponse;
import com.duynam.identityservice.dto.request.SystemSettingsUpdateRequest;
import com.duynam.identityservice.dto.response.SystemSettingsResponse;
import com.duynam.identityservice.service.SystemSettingsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SystemSettingsController {
    SystemSettingsService systemSettingsService;

    @GetMapping
    ApiResponse<SystemSettingsResponse> getSettings() {
        return ApiResponse.<SystemSettingsResponse>builder()
                .result(systemSettingsService.getSettings())
                .build();
    }

    @PutMapping
    ApiResponse<SystemSettingsResponse> updateSettings(@RequestBody SystemSettingsUpdateRequest request) {
        return ApiResponse.<SystemSettingsResponse>builder()
                .result(systemSettingsService.updateSettings(request))
                .build();
    }
}
