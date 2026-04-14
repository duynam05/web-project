package com.duynam.identityservice.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.duynam.identityservice.configuration.CloudinaryProperties;
import com.duynam.identityservice.dto.response.ImageUploadResponse;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryImageService {
    CloudinaryProperties cloudinaryProperties;
    org.springframework.beans.factory.ObjectProvider<Cloudinary> cloudinaryProvider;

    public ImageUploadResponse uploadBookImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST_BODY);
        }

        Cloudinary cloudinary = cloudinaryProvider.getIfAvailable();
        if (cloudinary == null || !cloudinaryProperties.isConfigured()) {
            throw new AppException(ErrorCode.CLOUDINARY_NOT_CONFIGURED);
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", cloudinaryProperties.getFolder(),
                            "resource_type", "image"
                    )
            );

            return ImageUploadResponse.builder()
                    .url((String) uploadResult.get("secure_url"))
                    .publicId((String) uploadResult.get("public_id"))
                    .originalFilename(file.getOriginalFilename())
                    .build();
        } catch (IOException exception) {
            throw new AppException(ErrorCode.CLOUDINARY_UPLOAD_FAILED);
        }
    }
}
