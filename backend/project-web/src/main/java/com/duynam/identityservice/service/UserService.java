package com.duynam.identityservice.service;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;

import com.duynam.identityservice.constant.UserStatus;
import com.duynam.identityservice.dto.request.ChangePasswordRequest;
import com.duynam.identityservice.dto.request.RegisterRequest;
import com.duynam.identityservice.dto.request.UpdateMyInfoRequest;
import com.duynam.identityservice.dto.request.UserStatusUpdateRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.duynam.identityservice.constant.PredefinedRole;
import com.duynam.identityservice.dto.request.UserCreationRequest;
import com.duynam.identityservice.dto.request.UserUpdateRequest;
import com.duynam.identityservice.dto.response.UserResponse;
import com.duynam.identityservice.entity.Role;
import com.duynam.identityservice.entity.User;
import com.duynam.identityservice.exception.AppException;
import com.duynam.identityservice.exception.ErrorCode;
import com.duynam.identityservice.mapper.UserMapper;
import com.duynam.identityservice.repository.RoleRepository;
import com.duynam.identityservice.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(UserCreationRequest request) {
        return createUserInternal(userMapper.toUser(request), request.getPassword(), request.getRoles());
    }

    public UserResponse registerUser(RegisterRequest request) {
        return createUserInternal(userMapper.toUser(request), request.getPassword(), null);
    }

    private UserResponse createUserInternal(User user, String rawPassword, List<String> requestedRoles) {
        if (userRepository.existsByEmail(user.getEmail())) throw new AppException(ErrorCode.USER_EXISTED);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setStatus(UserStatus.ACTIVE);

        user.setRoles(resolveRoles(requestedRoles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        System.out.println("ENTITY PHONE = " + user.getPhone());
        System.out.println("ENTITY ADDRESS = " + user.getAddress());

        UserResponse response = userMapper.toUserResponse(user);

        System.out.println("DTO PHONE = " + response.getPhone());
        System.out.println("DTO ADDRESS = " + response.getAddress());

        return response;
    }

    public UserResponse updateMyInfo(UpdateMyInfoRequest request) {
        User user = getCurrentUser();

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getTwoFactorEnabled() != null) {
            user.setTwoFactorEnabled(request.getTwoFactorEnabled());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);

        if (request.getRoles() != null) {
            var roles = roleRepository.findAllById(request.getRoles());
            user.setRoles(new HashSet<>(roles));
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUserStatus(String userId, UserStatusUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setStatus(parseUserStatus(request.getStatus()));
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private UserStatus parseUserStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            throw new AppException(ErrorCode.INVALID_USER_STATUS);
        }

        try {
            return UserStatus.valueOf(rawStatus.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new AppException(ErrorCode.INVALID_USER_STATUS);
        }
    }

    private HashSet<Role> resolveRoles(List<String> requestedRoles) {
        if (requestedRoles == null || requestedRoles.isEmpty()) {
            HashSet<Role> roles = new HashSet<>();
            roles.add(roleRepository
                    .findById(PredefinedRole.USER_ROLE)
                    .orElseThrow(() -> new IllegalStateException("USER role must exist before creating users")));
            return roles;
        }

        return new HashSet<>(roleRepository.findAllById(requestedRoles));
    }
}

