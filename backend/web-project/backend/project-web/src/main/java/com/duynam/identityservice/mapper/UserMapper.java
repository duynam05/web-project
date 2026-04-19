package com.duynam.identityservice.mapper;

import org.mapstruct.*;

import com.duynam.identityservice.dto.request.RegisterRequest;
import com.duynam.identityservice.dto.request.UserCreationRequest;
import com.duynam.identityservice.dto.request.UserUpdateRequest;
import com.duynam.identityservice.dto.response.UserResponse;
import com.duynam.identityservice.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "phone", ignore = true),
            @Mapping(target = "address", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "roles", ignore = true)
    })
    User toUser(UserCreationRequest request);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "phone", ignore = true),
            @Mapping(target = "address", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "roles", ignore = true)
    })
    User toUser(RegisterRequest request);

    UserResponse toUserResponse(User user);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "email", ignore = true),
            @Mapping(target = "password", ignore = true),
            @Mapping(target = "dob", ignore = true),
            @Mapping(target = "phone", ignore = true),
            @Mapping(target = "address", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "roles", ignore = true)
    })
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}

