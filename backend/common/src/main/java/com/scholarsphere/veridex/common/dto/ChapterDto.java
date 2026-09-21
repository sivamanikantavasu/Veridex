package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterDto {
    private String id;
    private String contentId;
    private Integer chapterNumber;
    private String title;
    private String bodyText;
    private Integer pageCount;
}
