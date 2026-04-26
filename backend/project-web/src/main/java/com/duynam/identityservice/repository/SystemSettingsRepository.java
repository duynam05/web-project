package com.duynam.identityservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.identityservice.entity.SystemSettings;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {
}
