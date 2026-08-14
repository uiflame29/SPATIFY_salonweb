package com.spatify.controller;

import com.spatify.model.*;
import com.spatify.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAnyRole('STAFF', 'MANAGER', 'ADMIN')")
public class StaffController {

    private final BookingRepository bookingRepository;
    private final PayrollRepository payrollRepository;
    private final AttendanceRepository attendanceRepository;
    private final AuditLogRepository auditLogRepository;

    public StaffController(BookingRepository bookingRepository, PayrollRepository payrollRepository,
                           AttendanceRepository attendanceRepository, AuditLogRepository auditLogRepository) {
        this.bookingRepository = bookingRepository;
        this.payrollRepository = payrollRepository;
        this.attendanceRepository = attendanceRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getStaffDashboard(@AuthenticationPrincipal User staff) {
        List<Booking> bookings = bookingRepository.findByStaffIdOrderByBookingDateDesc(staff.getId());
        
        long todaysBookings = bookings.stream()
                .filter(b -> b.getBookingDate().equals(java.time.LocalDate.now()))
                .count();
                
        double totalEarnings = bookings.stream()
                .filter(b -> b.getStatus().name().equals("COMPLETED"))
                .mapToDouble(b -> b.getService().getPrice() * 0.4) // Assuming 40% commission
                .sum();

        Map<String, Object> data = new HashMap<>();
        data.put("totalBookings", bookings.size());
        data.put("todaysBookings", todaysBookings);
        data.put("totalEarnings", totalEarnings);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getMyAppointments(@AuthenticationPrincipal User staff) {
        List<Booking> bookings = bookingRepository.findByStaffIdOrderByBookingDateDesc(staff.getId());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Booking b : bookings) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("customerName", b.getUser().getFullName());
            map.put("serviceName", b.getService().getName());
            map.put("bookingDate", b.getBookingDate().toString());
            map.put("timeSlot", b.getTimeSlot());
            map.put("status", b.getStatus().name());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/earnings")
    public ResponseEntity<?> getMyEarnings(@AuthenticationPrincipal User staff) {
        return ResponseEntity.ok(payrollRepository.findByStaffIdOrderByCutoffStartDesc(staff.getId()));
    }

    @GetMapping("/attendance")
    public ResponseEntity<?> getMyAttendance(@AuthenticationPrincipal User staff) {
        return ResponseEntity.ok(attendanceRepository.findByStaffIdOrderByDateDesc(staff.getId()));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getMyAuditLogs(@AuthenticationPrincipal User staff) {
        // Staff only sees their own logs (by email)
        List<AuditLog> allLogs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        List<AuditLog> myLogs = new ArrayList<>();
        for (AuditLog log : allLogs) {
            if (staff.getEmail().equalsIgnoreCase(log.getUserEmail())) {
                myLogs.add(log);
            }
        }
        return ResponseEntity.ok(myLogs);
    }
}
