package com.spatify.controller;

import com.spatify.model.*;
import com.spatify.model.enums.Role;
import com.spatify.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.spatify.util.IpUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final ServiceRepository serviceRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, BookingRepository bookingRepository,
            ReviewRepository reviewRepository, ServiceRepository serviceRepository,
            AuditLogRepository auditLogRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.serviceRepository = serviceRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("totalBookings", bookingRepository.count());
        data.put("totalServices", serviceRepository.count());
        data.put("totalReviews", reviewRepository.count());
        data.put("avgRating", reviewRepository.findAverageRating());
        return ResponseEntity.ok(data);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("name", u.getFullName());
            map.put("phone", u.getPhone());
            map.put("role", u.getRole().name());
            map.put("verified", u.isVerified());
            map.put("createdAt", u.getCreatedAt().toString());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        List<User> users = userRepository.findByRole(Role.valueOf(role.toUpperCase()));
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("name", u.getFullName());
            map.put("phone", u.getPhone());
            map.put("role", u.getRole().name());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body, HttpServletRequest request) {
        if (userRepository.existsByEmail(body.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        User user = new User();
        user.setEmail(body.get("email"));
        user.setPassword(passwordEncoder.encode(body.get("password")));
        user.setFirstName(body.get("firstName"));
        user.setLastName(body.get("lastName"));
        user.setPhone(body.get("phone"));
        user.setRole(Role.valueOf(body.get("role").toUpperCase()));
        user.setVerified(true);
        userRepository.save(user);
        
        auditLogRepository.save(new AuditLog(
            "admin@spatify.com", "System Admin", "ADMIN", 
            "Created User: " + user.getEmail() + " (Role: " + user.getRole().name() + ")", 
            IpUtils.getClientIp(request), "success"
        ));
        
        return ResponseEntity.ok(Map.of("message", "User created", "id", user.getId()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpServletRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            String email = user.getEmail();
            userRepository.deleteById(id);
            auditLogRepository.save(new AuditLog(
                "admin@spatify.com", "System Admin", "ADMIN", 
                "Deleted User: " + email, 
                IpUtils.getClientIp(request), "success"
            ));
        }
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body, HttpServletRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update fields if provided
        if (body.containsKey("firstName")) user.setFirstName(body.get("firstName"));
        if (body.containsKey("lastName")) user.setLastName(body.get("lastName"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("role")) user.setRole(Role.valueOf(body.get("role").toUpperCase()));
        
        // If password is provided and not empty, update it
        if (body.containsKey("password") && !body.get("password").trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(body.get("password")));
        }
        
        userRepository.save(user);
        
        auditLogRepository.save(new AuditLog(
            "admin@spatify.com", "System Admin", "ADMIN", 
            "Updated User: " + user.getEmail(), 
            IpUtils.getClientIp(request), "success"
        ));
        
        return ResponseEntity.ok(Map.of("message", "User updated successfully"));
    }


    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/audit-logs/role/{role}")
    public ResponseEntity<?> getAuditLogsByRole(@PathVariable String role) {
        return ResponseEntity.ok(auditLogRepository.findByUserRoleOrderByCreatedAtDesc(role.toUpperCase()));
    }

    // --- SERVICES MANAGEMENT ---
    @PostMapping("/services")
    public ResponseEntity<?> createService(@RequestBody com.spatify.model.SalonService service) {
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id,
            @RequestBody com.spatify.model.SalonService serviceDetails) {
        com.spatify.model.SalonService service = serviceRepository.findById(id).orElse(null);
        if (service == null)
            return ResponseEntity.notFound().build();
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setPrice(serviceDetails.getPrice());
        service.setDurationMinutes(serviceDetails.getDurationMinutes());
        service.setCategory(serviceDetails.getCategory());
        service.setActive(serviceDetails.isActive());
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        serviceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Service deleted"));
    }

    // --- REVIEWS MANAGEMENT ---
    @PostMapping("/reviews/{id}/reply")
    public ResponseEntity<?> replyToReview(@PathVariable Long id, @RequestBody Map<String, String> body) {
        com.spatify.model.Review review = reviewRepository.findById(id).orElse(null);
        if (review == null)
            return ResponseEntity.notFound().build();
        review.setResponse(body.get("response"));
        review.setResponded(true);
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}
