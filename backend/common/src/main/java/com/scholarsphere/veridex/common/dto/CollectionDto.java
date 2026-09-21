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
public class CollectionDto {
    private String id;
    private String userId;
    private String name;
    private Integer count;
    private String createdAt;
    private List<String> contentIds;
    private List<ContentDto> items;
}
