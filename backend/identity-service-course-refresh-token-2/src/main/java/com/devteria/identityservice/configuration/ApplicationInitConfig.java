package com.devteria.identityservice.configuration;

import java.util.HashSet;
import java.util.List;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.devteria.identityservice.constant.PredefinedRole;
import com.devteria.identityservice.constant.UserStatus;
import com.devteria.identityservice.entity.Role;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.repository.RoleRepository;
import com.devteria.identityservice.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    BootstrapAdminProperties bootstrapAdminProperties;
    PasswordEncoder passwordEncoder;

    @Bean
    @ConditionalOnProperty(
            prefix = "spring.datasource",
            value = "driver-class-name",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        log.info("Initializing application.....");
        return args -> {
            ensureRoleExists(roleRepository, PredefinedRole.USER_ROLE, "User role");
            ensureRoleExists(roleRepository, PredefinedRole.ADMIN_ROLE, "Admin role");
            backfillMissingUserStatus(userRepository);

            if (!bootstrapAdminProperties.isEnabled()) {
                log.info("Admin bootstrap is disabled");
                log.info("Application initialization completed .....");
                return;
            }

            validateBootstrapConfiguration();

            if (userRepository.findByEmail(bootstrapAdminProperties.getEmail()).isEmpty()) {
                Role adminRole = roleRepository
                        .findById(PredefinedRole.ADMIN_ROLE)
                        .orElseThrow(() -> new IllegalStateException("ADMIN role must exist before bootstrap"));

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .email(bootstrapAdminProperties.getEmail())
                        .password(passwordEncoder.encode(bootstrapAdminProperties.getPassword()))
                        .fullName(bootstrapAdminProperties.getFullName())
                        .status(UserStatus.ACTIVE)
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("Bootstrap admin {} has been created from environment configuration",
                        bootstrapAdminProperties.getEmail());
            } else {
                log.info("Bootstrap admin {} already exists, skipping creation", bootstrapAdminProperties.getEmail());
            }

            log.info("Application initialization completed .....");
        };
    }

    private void ensureRoleExists(RoleRepository roleRepository, String roleName, String description) {
        if (!roleRepository.existsById(roleName)) {
            roleRepository.save(Role.builder().name(roleName).description(description).build());
        }
    }

    private void backfillMissingUserStatus(UserRepository userRepository) {
        List<User> usersWithoutStatus = userRepository.findAll().stream()
                .filter(user -> user.getStatus() == null)
                .peek(user -> user.setStatus(UserStatus.ACTIVE))
                .toList();

        if (!usersWithoutStatus.isEmpty()) {
            userRepository.saveAll(usersWithoutStatus);
            log.info("Backfilled ACTIVE status for {} existing users", usersWithoutStatus.size());
        }
    }

    private void validateBootstrapConfiguration() {
        if (isBlank(bootstrapAdminProperties.getEmail()) || isBlank(bootstrapAdminProperties.getPassword())) {
            throw new AppException(ErrorCode.BOOTSTRAP_CONFIG_MISSING);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
