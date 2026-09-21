package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadingHistoryDto {
    private String id;
    private String userId;
    private String contentId;
    private String title;
    private String author;
    private String type;
    private Integer progress;
    private String lastRead;
    private Integer lastChapter;
    private Integer lastPage;
}
