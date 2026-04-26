package com.duynam.identityservice.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SystemSettingsResponse {
    String storeName;
    String supportPhone;
    String officeAddress;
    Boolean periodicEmail;
    Boolean stockAlert;
    Boolean newReview;
}
