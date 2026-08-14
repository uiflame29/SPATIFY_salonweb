package com.spatify.repository;

import com.spatify.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByStaffIdOrderByCutoffStartDesc(Long staffId);
    List<Payroll> findByStatus(String status);
}
