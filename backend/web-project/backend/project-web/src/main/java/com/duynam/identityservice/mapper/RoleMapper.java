package com.duynam.identityservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.duynam.identityservice.dto.request.RoleRequest;
import com.duynam.identityservice.dto.response.RoleResponse;
import com.duynam.identityservice.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}

