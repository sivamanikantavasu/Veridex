package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadingTrackRequest {
    private String userId;
    private String contentId;
    private String contentTitle;
    private Integer chapter;
    private Integer page;
    private Integer progress; // percentage 0-100
    private Integer durationSeconds;
}
