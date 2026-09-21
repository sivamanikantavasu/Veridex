package com.scholarsphere.veridex.usageservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "reading_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadingEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String contentId;

    @Column(nullable = false)
    private String contentTitle;

    private Integer chapter;
    private Integer page;
    private Integer progress;
    private Integer durationSeconds;

    @Column(nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
