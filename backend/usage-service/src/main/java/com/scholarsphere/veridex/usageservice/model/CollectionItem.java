package com.scholarsphere.veridex.usageservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "collection_items", uniqueConstraints = @UniqueConstraint(columnNames = {"collection_id", "content_id"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CollectionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "collection_id", nullable = false)
    private String collectionId;

    @Column(name = "content_id", nullable = false)
    private String contentId;
}