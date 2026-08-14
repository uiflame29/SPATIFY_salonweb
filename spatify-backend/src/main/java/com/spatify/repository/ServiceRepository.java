package com.spatify.repository;

import com.spatify.model.SalonService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<SalonService, Long> {
    List<SalonService> findByActiveTrue();
    List<SalonService> findByCategory(String category);
}
