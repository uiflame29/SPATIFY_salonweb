package com.spatify.config;

import com.spatify.model.*;
import com.spatify.model.enums.BookingStatus;
import com.spatify.model.enums.PaymentMethod;
import com.spatify.model.enums.Role;
import com.spatify.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final AuditLogRepository auditLogRepository;
    private final InventoryRepository inventoryRepository;
    private final PayrollRepository payrollRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, ServiceRepository serviceRepository,
                           ReviewRepository reviewRepository, BookingRepository bookingRepository,
                           AuditLogRepository auditLogRepository, InventoryRepository inventoryRepository,
                           PayrollRepository payrollRepository, AttendanceRepository attendanceRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.auditLogRepository = auditLogRepository;
        this.inventoryRepository = inventoryRepository;
        this.payrollRepository = payrollRepository;
        this.attendanceRepository = attendanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Force admin user credentials
        User adminUser = userRepository.findByEmail("admin").orElse(null);
        if (adminUser == null) {
            saveUser("admin", "admin123", "System", "Administrator", "+63 000 000 0000", Role.ADMIN);
        } else {
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.ADMIN);
            adminUser.setVerified(true);
            userRepository.save(adminUser);
        }

        if (true) return; // DB is already seeded via dump
        System.out.println("🧹 Clearing existing database data...");
        auditLogRepository.deleteAll();
        payrollRepository.deleteAll();
        attendanceRepository.deleteAll();
        bookingRepository.deleteAll();
        reviewRepository.deleteAll();
        inventoryRepository.deleteAll();
        userRepository.deleteAll();
        serviceRepository.deleteAll();

        System.out.println("🌱 Seeding database with EXACT requested accounts...");

        // === USERS ===
        saveUser("admin", "admin123", "System", "Administrator", "+63 000 000 0000", Role.ADMIN);
        saveUser("admin@spatify.ph", "Admin@123456!", "Admin", "Spatify", "+63 917 333 4444", Role.ADMIN);
        
        saveUser("manager@test.com", "Manager@123456!", "Michael", "Torres", "+63 918 111 2222", Role.MANAGER);
        saveUser("manager@spatify.ph", "Manager@123456!", "Manager", "Spatify", "+63 918 333 4444", Role.MANAGER);
        
        User staff1 = saveUser("staff@spatify.ph", "Staff@123456!", "Maria", "Santos", "+63 919 111 2222", Role.STAFF);
        User staff2 = saveUser("staff1@spatify.com", "Mari@Spatify2026", "Sophia", "Reyes", "+63 900 111 2222", Role.STAFF);
        saveUser("staff2@spatify.com", "John@Spatify2026", "John", "Dela Cruz", "+63 900 222 3333", Role.STAFF);
        
        User cust1 = saveUser("anna@example.com", "Anna@Password123!", "Anna", "D.", "+63 920 111 2222", Role.CUSTOMER);
        User cust2 = saveUser("customer@test.com", "Customer123!", "Isabella", "Luna", "+63 921 333 4444", Role.CUSTOMER);
        saveUser("carlos@example.com", "Carl@Spatify2026", "Carlos", "M.", "+63 922 111 2222", Role.CUSTOMER);

        // === SERVICES ===
        SalonService s1 = saveService("Royal Hair Spa", "Hair Care", 2500, 90, "Deep conditioning with essential oils.");
        SalonService s2 = saveService("Executive Haircut", "Hair Care", 850, 45, "Precision grooming with expert styling.");
        SalonService s3 = saveService("Diamond Facial", "Skincare", 4500, 75, "Advanced resurfacing for bright complexion.");
        SalonService s4 = saveService("Zen Stone Massage", "Wellness", 3200, 90, "Therapeutic massage with heated stones.");

        // === BOOKINGS & REVIEWS ===
        saveBooking(cust1, s1, staff1, BookingStatus.CONFIRMED, 2500);
        saveBooking(cust1, s3, staff2, BookingStatus.COMPLETED, 4500);
        saveBooking(cust2, s2, staff1, BookingStatus.CONFIRMED, 850);

        saveReview(cust1, "Royal Hair Spa", 5, "The Royal Hair Spa was incredible. My hair has never felt this soft!");
        saveReview(cust2, "Diamond Facial", 5, "The Diamond Facial literally changed my skin. Highly recommend Isabella.");

        // === PAYROLL & ATTENDANCE SEEDING ===
        savePayroll(staff1, LocalDate.of(2026, 4, 16), LocalDate.of(2026, 4, 30), 80, 150, 12000, 1000, 11000, "PROCESSED");
        savePayroll(staff2, LocalDate.of(2026, 4, 16), LocalDate.of(2026, 4, 30), 75, 150, 11250, 900, 10350, "PAID");

        saveAttendance(staff1, LocalDate.of(2026, 4, 16), java.time.LocalTime.of(8, 55), java.time.LocalTime.of(18, 5));
        saveAttendance(staff2, LocalDate.of(2026, 4, 16), java.time.LocalTime.of(8, 50), java.time.LocalTime.of(18, 0));

        System.out.println("✅ Database re-seeded! All 13 accounts are active and connected.");
    }

    private User saveUser(String email, String password, String firstName, String lastName, String phone, Role role) {
        User user = new User(email, passwordEncoder.encode(password), firstName, lastName, phone, role);
        user.setVerified(true);
        return userRepository.save(user);
    }

    private SalonService saveService(String name, String category, double price, int duration, String description) {
        return serviceRepository.save(new SalonService(name, category, price, duration, description));
    }

    private void saveReview(User user, String serviceName, int rating, String text) {
        reviewRepository.save(new Review(user, serviceName, rating, text));
    }

    private void saveBooking(User user, SalonService service, User staff, BookingStatus status, double amount) {
        Booking b = new Booking();
        b.setUser(user);
        b.setService(service);
        b.setStaff(staff);
        b.setStatus(status);
        b.setAmount(amount);
        b.setBookingDate(LocalDate.now());
        b.setTimeSlot("10:00 AM");
        b.setPaymentMethod(PaymentMethod.CASH);
        bookingRepository.save(b);
    }

    private void savePayroll(User staff, LocalDate start, LocalDate end, double hours, double rate, double gross, double deductions, double net, String status) {
        Payroll p = new Payroll();
        p.setStaff(staff);
        p.setCutoffStart(start);
        p.setCutoffEnd(end);
        p.setHoursWorked(hours);
        p.setHourlyRate(rate);
        p.setGrossPay(gross);
        p.setDeductions(deductions);
        p.setNetPay(net);
        p.setStatus(status);
        payrollRepository.save(p);
    }

    private void saveAttendance(User staff, LocalDate date, java.time.LocalTime checkIn, java.time.LocalTime checkOut) {
        Attendance a = new Attendance();
        a.setStaff(staff);
        a.setDate(date);
        a.setCheckIn(checkIn);
        a.setCheckOut(checkOut);
        a.setStatus("PRESENT");
        attendanceRepository.save(a);
    }
}
