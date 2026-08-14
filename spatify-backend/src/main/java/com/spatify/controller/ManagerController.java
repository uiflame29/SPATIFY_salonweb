package com.spatify.controller;

import com.spatify.model.*;
import com.spatify.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class ManagerController {

    private final InventoryRepository inventoryRepository;
    private final PayrollRepository payrollRepository;
    private final AttendanceRepository attendanceRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public ManagerController(InventoryRepository inventoryRepository, PayrollRepository payrollRepository,
            AttendanceRepository attendanceRepository, BookingRepository bookingRepository,
            UserRepository userRepository, AuditLogRepository auditLogRepository) {
        this.inventoryRepository = inventoryRepository;
        this.payrollRepository = payrollRepository;
        this.attendanceRepository = attendanceRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getManagerDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalInventoryItems", inventoryRepository.count());
        data.put("lowStockItems", inventoryRepository.findByStatus("LOW_STOCK").size());
        data.put("pendingPayroll", payrollRepository.findByStatus("PENDING").size());

        // Count today's bookings
        long todaysBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate().equals(java.time.LocalDate.now()))
                .count();
        data.put("todaysBookings", todaysBookings);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/inventory")
    public ResponseEntity<?> getInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping("/inventory")
    public ResponseEntity<?> addInventoryItem(@RequestBody Inventory item) {
        if (item.getCurrentStock() <= item.getReorderLevel()) {
            item.setStatus("LOW_STOCK");
        } else {
            item.setStatus("OK");
        }
        return ResponseEntity.ok(inventoryRepository.save(item));
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<?> updateInventoryStock(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Inventory item = inventoryRepository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();

        int newStock = body.get("currentStock");
        item.setCurrentStock(newStock);
        if (newStock <= item.getReorderLevel()) {
            item.setStatus("LOW_STOCK");
        } else {
            item.setStatus("OK");
        }
        return ResponseEntity.ok(inventoryRepository.save(item));
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<?> deleteInventoryItem(@PathVariable Long id) {
        inventoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Inventory item deleted"));
    }

    @GetMapping("/payroll")
    public ResponseEntity<?> getPayroll() {
        return ResponseEntity.ok(payrollRepository.findAll());
    }

    @PostMapping("/payroll")
    public ResponseEntity<?> createPayroll(@RequestBody Map<String, Object> body) {
        Long staffId = Long.valueOf(body.get("staffId").toString());
        User staff = userRepository.findById(staffId).orElse(null);
        if (staff == null) return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));

        Payroll p = new Payroll();
        p.setStaff(staff);
        p.setCutoffStart(java.time.LocalDate.parse(body.get("cutoffStart").toString()));
        p.setCutoffEnd(java.time.LocalDate.parse(body.get("cutoffEnd").toString()));
        p.setHoursWorked(Double.parseDouble(body.get("hoursWorked").toString()));
        p.setHourlyRate(Double.parseDouble(body.get("hourlyRate").toString()));
        p.setGrossPay(Double.parseDouble(body.get("grossPay").toString()));
        p.setDeductions(Double.parseDouble(body.get("deductions").toString()));
        p.setNetPay(Double.parseDouble(body.get("netPay").toString()));
        p.setStatus(body.getOrDefault("status", "PENDING").toString());
        
        return ResponseEntity.ok(payrollRepository.save(p));
    }

    @PutMapping("/payroll/{id}")
    public ResponseEntity<?> updatePayrollStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Payroll p = payrollRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        p.setStatus(body.get("status"));
        return ResponseEntity.ok(payrollRepository.save(p));
    }

    @DeleteMapping("/payroll/{id}")
    public ResponseEntity<?> deletePayroll(@PathVariable Long id) {
        payrollRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Payroll record deleted"));
    }

    // --- ATTENDANCE MANAGEMENT ---

    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendance() {
        return ResponseEntity.ok(attendanceRepository.findAll());
    }

    @PostMapping("/attendance/clock-in")
    public ResponseEntity<?> clockIn(@RequestBody Map<String, Long> body) {
        User staff = userRepository.findById(body.get("staffId")).orElse(null);
        if (staff == null) return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));

        Attendance a = new Attendance();
        a.setStaff(staff);
        a.setDate(java.time.LocalDate.now());
        a.setCheckIn(java.time.LocalTime.now());
        a.setStatus("PRESENT");
        return ResponseEntity.ok(attendanceRepository.save(a));
    }

    @PutMapping("/attendance/clock-out/{id}")
    public ResponseEntity<?> clockOut(@PathVariable Long id) {
        Attendance a = attendanceRepository.findById(id).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        
        a.setCheckOut(java.time.LocalTime.now());
        return ResponseEntity.ok(attendanceRepository.save(a));
    }

    @DeleteMapping("/attendance/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        attendanceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Attendance record deleted"));
    }

    @GetMapping("/staff/activity")
    public ResponseEntity<?> getStaffActivity() {
        List<User> staff = userRepository.findByRole(com.spatify.model.enums.Role.STAFF);
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : staff) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getFullName());
            map.put("email", u.getEmail());
            map.put("status", "Active"); // Mock status
            // Count recent bookings for this staff
            long bookingsHandled = bookingRepository.findByStaffIdOrderByBookingDateDesc(u.getId()).size();
            map.put("bookingsHandled", bookingsHandled);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getManagerAuditLogs() {
        // Manager can see STAFF and CUSTOMER logs, but not ADMIN logs
        List<AuditLog> allLogs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        List<AuditLog> filteredLogs = new ArrayList<>();
        for (AuditLog log : allLogs) {
            if ("STAFF".equals(log.getUserRole()) || "CUSTOMER".equals(log.getUserRole())
                    || "MANAGER".equals(log.getUserRole())) {
                filteredLogs.add(log);
            }
        }
        return ResponseEntity.ok(filteredLogs);
    }
}
