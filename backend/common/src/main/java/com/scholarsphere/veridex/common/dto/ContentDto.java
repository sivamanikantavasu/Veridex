package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentDto {
    private String id;
    private String title;
    private String type;        // "book", "journal", "research", "monograph", "textbook"
    private String author;
    private String status;      // "published", "draft", "archived"
    private String accessLevel; // "open", "subscribed", "premium"
    private String subject;
    private String language;
    private String year;
    private String description;
    private Integer totalPages;
    private String coverUrl;
    private String createdAt;
    private String resourceName;
    private String resourceContentType;
}
