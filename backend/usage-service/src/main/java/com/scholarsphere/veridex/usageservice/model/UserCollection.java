package com.scholarsphere.veridex.usageservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_collections")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class UserCollection {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}