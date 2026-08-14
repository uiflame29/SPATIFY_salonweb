package com.spatify.repository;

import com.spatify.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<AuditLog> findByUserRoleOrderByCreatedAtDesc(String userRole);
    List<AuditLog> findAllByOrderByCreatedAtDesc();
    List<AuditLog> findByActionContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(String action, String status);
}
