package com.duynam.identityservice.dto.request;

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
public class SystemSettingsUpdateRequest {
    String storeName;
    String supportPhone;
    String officeAddress;
    Boolean periodicEmail;
    Boolean stockAlert;
    Boolean newReview;
}
