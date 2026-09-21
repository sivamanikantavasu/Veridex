package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDto {
    private String id;
    private String timestamp;
    private String eventType; // "login", "access", "entitlement", "admin"
    private String actor;
    private String target;
    private String severity;  // "info", "warning", "critical", "success"
    private String ip;
    private String details;
}
