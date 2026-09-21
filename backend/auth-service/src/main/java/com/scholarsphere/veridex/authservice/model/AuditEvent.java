package com.scholarsphere.veridex.authservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "audit_events")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditEvent {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false) private Instant timestamp;
    @Column(nullable = false) private String eventType;
    @Column(nullable = false) private String actor;
    private String target;
    @Column(nullable = false) private String severity;
    private String ip;
    private String details;
}