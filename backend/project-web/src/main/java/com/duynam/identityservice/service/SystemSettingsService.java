package com.duynam.identityservice.service;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.duynam.identityservice.dto.request.SystemSettingsUpdateRequest;
import com.duynam.identityservice.dto.response.SystemSettingsResponse;
import com.duynam.identityservice.entity.SystemSettings;
import com.duynam.identityservice.repository.SystemSettingsRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SystemSettingsService {
    private static final long DEFAULT_SETTINGS_ID = 1L;

    SystemSettingsRepository systemSettingsRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public SystemSettingsResponse getSettings() {
        return toResponse(getOrCreateSettings());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public SystemSettingsResponse updateSettings(SystemSettingsUpdateRequest request) {
        SystemSettings settings = getOrCreateSettings();

        if (request.getStoreName() != null) {
            settings.setStoreName(request.getStoreName().trim());
        }
        if (request.getSupportPhone() != null) {
            settings.setSupportPhone(request.getSupportPhone().trim());
        }
        if (request.getOfficeAddress() != null) {
            settings.setOfficeAddress(request.getOfficeAddress().trim());
        }
        if (request.getPeriodicEmail() != null) {
            settings.setPeriodicEmail(request.getPeriodicEmail());
        }
        if (request.getStockAlert() != null) {
            settings.setStockAlert(request.getStockAlert());
        }
        if (request.getNewReview() != null) {
            settings.setNewReview(request.getNewReview());
        }

        return toResponse(systemSettingsRepository.save(settings));
    }

    public void ensureDefaultSettings() {
        getOrCreateSettings();
    }

    private SystemSettings getOrCreateSettings() {
        return systemSettingsRepository.findById(DEFAULT_SETTINGS_ID)
                .orElseGet(() -> systemSettingsRepository.save(SystemSettings.builder()
                        .id(DEFAULT_SETTINGS_ID)
                        .storeName("BookStore")
                        .supportPhone("")
                        .officeAddress("")
                        .periodicEmail(true)
                        .stockAlert(true)
                        .newReview(false)
                        .build()));
    }

    private SystemSettingsResponse toResponse(SystemSettings settings) {
        return SystemSettingsResponse.builder()
                .storeName(settings.getStoreName())
                .supportPhone(settings.getSupportPhone())
                .officeAddress(settings.getOfficeAddress())
                .periodicEmail(settings.getPeriodicEmail())
                .stockAlert(settings.getStockAlert())
                .newReview(settings.getNewReview())
                .build();
    }
}
