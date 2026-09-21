package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntitlementDto {
    private String id;
    private String plan;            // "reader", "scholar", "institution"
    private String contentType;     // "book", "journal", "research", or "all"
    private String subject;         // e.g. "Medicine", "Law", "All"
    private Integer deviceLimit;
    private Integer concurrentLimit;
    private Boolean readOnly;
    private Boolean noDownload;
    private String dateFrom;
    private String dateTo;
}
