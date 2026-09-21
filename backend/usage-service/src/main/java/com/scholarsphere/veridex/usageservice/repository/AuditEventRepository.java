package com.scholarsphere.veridex.usageservice.repository;

import com.scholarsphere.veridex.usageservice.model.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditEventRepository extends JpaRepository<AuditEvent, String> {
    List<AuditEvent> findTop200ByOrderByTimestampDesc();
}