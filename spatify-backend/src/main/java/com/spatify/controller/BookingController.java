package com.spatify.controller;

import com.spatify.dto.BookingRequest;
import com.spatify.model.*;
import com.spatify.model.enums.*;
import com.spatify.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.spatify.util.IpUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public BookingController(BookingRepository bookingRepository, ServiceRepository serviceRepository,
            UserRepository userRepository, AuditLogRepository auditLogRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(@AuthenticationPrincipal User user) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Booking b : bookings) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("serviceName", b.getService().getName());
            map.put("bookingDate", b.getBookingDate().toString());
            map.put("timeSlot", b.getTimeSlot());
            map.put("amount", b.getAmount());
            map.put("paymentMethod", b.getPaymentMethod().name());
            map.put("status", b.getStatus().name());
            map.put("refNo", b.getRefNo());
            map.put("staffName", b.getStaff() != null ? b.getStaff().getFullName() : "TBD");
            map.put("duration", b.getService().getDurationMinutes());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@AuthenticationPrincipal User user, @RequestBody BookingRequest req, HttpServletRequest httpRequest) {
        SalonService service = serviceRepository.findById(req.getServiceId()).orElse(null);
        if (service == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Service not found"));

        User staff = req.getStaffId() != null ? userRepository.findById(req.getStaffId()).orElse(null) : null;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setStaff(staff);
        booking.setBookingDate(LocalDate.parse(req.getBookingDate()));
        booking.setTimeSlot(req.getTimeSlot());

        PaymentMethod pm = "maya".equalsIgnoreCase(req.getPaymentMethod())
                || "paymaya".equalsIgnoreCase(req.getPaymentMethod())
                        ? PaymentMethod.PAYMAYA
                        : PaymentMethod.CASH;
        booking.setPaymentMethod(pm);

        double fee = pm == PaymentMethod.PAYMAYA ? service.getPrice() * 0.02 : 0;
        booking.setProcessingFee(fee);
        booking.setAmount(service.getPrice() + fee + 15);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setRefNo("SPT-" + System.currentTimeMillis());

        bookingRepository.save(booking);

        auditLogRepository.save(new AuditLog(
                user.getEmail(), user.getFullName(), user.getRole().name(),
                "Booking Created: " + service.getName(), IpUtils.getClientIp(httpRequest), "success"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", booking.getId());
        response.put("refNo", booking.getRefNo());
        response.put("serviceName", service.getName());
        response.put("amount", booking.getAmount());
        response.put("status", booking.getStatus().name());
        response.put("bookingDate", booking.getBookingDate().toString());
        response.put("timeSlot", booking.getTimeSlot());
        response.put("paymentMethod", pm.name());
        response.put("processingFee", fee);
        response.put("environmentalTax", 15);
        response.put("servicePrice", service.getPrice());
        response.put("duration", service.getDurationMinutes());
        response.put("staffName", staff != null ? staff.getFullName() : "Any Available");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Booking b : bookings) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("customerName", b.getUser().getFullName());
            map.put("serviceName", b.getService().getName());
            map.put("bookingDate", b.getBookingDate().toString());
            map.put("timeSlot", b.getTimeSlot());
            map.put("amount", b.getAmount());
            map.put("status", b.getStatus().name());
            map.put("refNo", b.getRefNo());
            map.put("staffName", b.getStaff() != null ? b.getStaff().getFullName() : "TBD");
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null)
            return ResponseEntity.notFound().build();
        booking.setStatus(BookingStatus.valueOf(body.get("status")));
        bookingRepository.save(booking);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}
