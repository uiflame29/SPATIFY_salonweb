package com.spatify.controller;

import com.spatify.dto.*;
import com.spatify.model.AuditLog;
import com.spatify.model.User;
import com.spatify.model.enums.Role;
import com.spatify.repository.AuditLogRepository;
import com.spatify.repository.UserRepository;
import com.spatify.security.JwtTokenProvider;
import com.spatify.util.IpUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogRepository auditLogRepository;
    private final com.spatify.service.EmailService emailService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider, AuditLogRepository auditLogRepository,
                          com.spatify.service.EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditLogRepository = auditLogRepository;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ip = IpUtils.getClientIp(httpRequest);
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        
        System.out.println("🔐 Login Attempt: " + email + " from IP: " + ip);
        
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("❌ Login Failed: " + (user == null ? "User not found" : "Invalid password") + " for " + email);
            auditLogRepository.save(new AuditLog(
                email, "Unknown", "unknown", "Login Failed", ip, "failed"
            ));
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        System.out.println("✅ Login Success: " + email + " (" + user.getRole().name() + ")");

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        auditLogRepository.save(new AuditLog(
            user.getEmail(), user.getFullName(), user.getRole().name(), "Login Success", ip, "success"
        ));

        return ResponseEntity.ok(new AuthResponse(
            token, user.getEmail(), user.getFullName(), user.getRole().name(), user.getPhone(), user.getId()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String ip = IpUtils.getClientIp(httpRequest);
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        // Password Validation (8+ characters, upper, lower, number, special)
        String password = request.getPassword();
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!password.matches(passwordRegex)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(Role.CUSTOMER);
        user.setEmailNotifications(request.isEmailNotifications());
        user.setSmsNotifications(request.isSmsNotifications());
        user.setVerified(false); // User must verify OTP first

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(15)); // Valid for 15 minutes

        userRepository.save(user);

        // Send real email via SMTP
        emailService.sendOtpEmail(user.getEmail(), otp);

        auditLogRepository.save(new AuditLog(
            user.getEmail(), user.getFullName(), "CUSTOMER", "Account Created (Pending OTP)", ip, "success"
        ));

        // Return basic info including otpCode for development visibility
        return ResponseEntity.ok(Map.of(
            "email", user.getEmail(),
            "otpCode", otp,
            "message", "Registration successful. Please verify your OTP."
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String email = request.get("email") != null ? request.get("email").trim().toLowerCase() : "";
        String otp = request.get("otp");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is already verified"));
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP code"));
        }

        if (user.getOtpExpiry() != null && user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP code has expired. Please request a new one."));
        }

        // OTP is valid
        user.setVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        String ip = IpUtils.getClientIp(httpRequest);
        auditLogRepository.save(new AuditLog(
            user.getEmail(), user.getFullName(), "CUSTOMER", "OTP Verified & Account Activated", ip, "success"
        ));

        // Generate token and login user automatically
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(new AuthResponse(
            token, user.getEmail(), user.getFullName(), user.getRole().name(), user.getPhone(), user.getId()
        ));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email") != null ? request.get("email").trim().toLowerCase() : "";
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is already verified"));
        }

        // Generate new 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send real email via SMTP
        emailService.sendOtpEmail(user.getEmail(), otp);

        return ResponseEntity.ok(Map.of("message", "A new OTP has been sent to your email."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String email = request.get("email");
        String ip = IpUtils.getClientIp(httpRequest);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            // In a real app, we would generate a reset token and send a link.
            // For now, we'll log the attempt and return success to avoid user enumeration.
            auditLogRepository.save(new AuditLog(
                email, user.getFullName(), user.getRole().name(), "Password Reset Requested", ip, "success"
            ));
            
            // Mock sending email
            System.out.println("📧 Mock: Sending password reset instructions to " + email);
        } else {
            auditLogRepository.save(new AuditLog(
                email, "Unknown", "unknown", "Password Reset Attempted (Email not found)", ip, "failed"
            ));
        }

        // Always return the same message for security (don't reveal if email exists)
        return ResponseEntity.ok(Map.of("message", "If an account exists with this email, you will receive password reset instructions shortly."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "User not found"));

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("email", user.getEmail());
        data.put("name", user.getFullName());
        data.put("firstName", user.getFirstName());
        data.put("lastName", user.getLastName());
        data.put("phone", user.getPhone());
        data.put("role", user.getRole().name());
        data.put("emailNotifications", user.isEmailNotifications());
        data.put("smsNotifications", user.isSmsNotifications());
        data.put("verified", user.isVerified());
        data.put("createdAt", user.getCreatedAt().toString());
        return ResponseEntity.ok(data);
    }
}
