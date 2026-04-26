package com.duynam.identityservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SystemSettings {
    @Id
    Long id;

    @Column(nullable = false)
    String storeName;

    String supportPhone;
    String officeAddress;

    @Builder.Default
    @Column(nullable = false)
    Boolean periodicEmail = true;

    @Builder.Default
    @Column(nullable = false)
    Boolean stockAlert = true;

    @Builder.Default
    @Column(nullable = false)
    Boolean newReview = false;
}
