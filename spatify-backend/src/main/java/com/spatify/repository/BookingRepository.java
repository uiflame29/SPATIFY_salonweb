package com.spatify.repository;

import com.spatify.model.Booking;
import com.spatify.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByStaffIdOrderByBookingDateDesc(Long staffId);
    List<Booking> findByStatus(BookingStatus status);
    Optional<Booking> findByRefNo(String refNo);
    long countByStatus(BookingStatus status);
}
