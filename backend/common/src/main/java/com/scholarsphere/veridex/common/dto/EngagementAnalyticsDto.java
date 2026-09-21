package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngagementAnalyticsDto {
    private Double readingHours;
    private Double completionRate;
    private Integer activeUsers;
    private List<ReadingSessionDto> sessions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadingSessionDto {
        private String id;
        private String userId;
        private String contentId;
        private String contentTitle;
        private Integer durationMinutes;
        private String timestamp;
    }
}
