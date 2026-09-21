package com.scholarsphere.veridex.contentservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "content_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String accessLevel;

    private String subject;
    private String language;
    @Column(name = "publication_year")
    private String year;
    private String description;
    private Integer totalPages;
    private String coverUrl;
    private String createdAt;

    private String resourceName;
    private String resourceContentType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] resourceBytes;
}
