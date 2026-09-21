package com.scholarsphere.veridex.authservice.repository;

import com.scholarsphere.veridex.authservice.model.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditEventRepository extends JpaRepository<AuditEvent, String> {}