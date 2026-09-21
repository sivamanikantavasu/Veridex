package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessCheckResponse {
    private boolean hasAccess;
    private String reason;
    private boolean readOnly;
    private boolean noDownload;
    private Integer concurrentLimit;
    private Integer deviceLimit;
    private String watermarkText;
}
