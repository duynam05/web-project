package com.duynam.identityservice.mapper;

import org.mapstruct.Mapper;

import com.duynam.identityservice.dto.request.PermissionRequest;
import com.duynam.identityservice.dto.response.PermissionResponse;
import com.duynam.identityservice.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}

