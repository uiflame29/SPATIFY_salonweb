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
        ensureSeedUser("admin@spatify.com", "Alex@Spatify2026", "Alexandra", "Chen", "+63 917 000 0001", Role.ADMIN);
        ensureSeedUser("admin@spatify.ph", "Admin@123456!", "Admin", "Spatify", "+63 917 333 4444", Role.ADMIN);
        ensureSeedUser("manager@spatify.com", "Mich@Spatify2026", "Michael", "Torres", "+63 918 111 2222", Role.MANAGER);
        ensureSeedUser("manager@spatify.ph", "Manager@123456!", "Manager", "Spatify", "+63 918 333 4444", Role.MANAGER);
        ensureSeedUser("maria@spatify.ph", "Maria@Spatify123!", "Maria", "Santos", "+63 919 111 2222", Role.STAFF);
        ensureSeedUser("staff1@spatify.com", "Mari@Spatify2026", "Sophia", "Reyes", "+63 900 111 2222", Role.STAFF);
        ensureSeedUser("staff2@spatify.com", "John@Spatify2026", "John", "Dela Cruz", "+63 900 222 3333", Role.STAFF);
        ensureSeedUser("staff@spatify.com", "Rosa@Spatify2026", "Rosa", "Garcia", "+63 900 333 4444", Role.STAFF);
        ensureSeedUser("anna@example.com", "Anna@Password123!", "Anna", "D.", "+63 920 111 2222", Role.CUSTOMER);
        ensureSeedUser("customer@spatify.com", "Cust@Spatify2026", "Isabella", "Luna", "+63 921 333 4444", Role.CUSTOMER);
        ensureSeedUser("carlos@example.com", "Carl@Spatify2026", "Carlos", "M.", "+63 922 111 2222", Role.CUSTOMER);
        ensureSeedUser("elena@example.com", "Elen@Spatify2026", "Elena", "F.", "+63 923 111 2222", Role.CUSTOMER);

        // Keep the legacy compatibility admin available for older local login flows.
        ensureSeedUser("admin", "admin123", "System", "Administrator", "+63 000 000 0000", Role.ADMIN);

        System.out.println("✅ Demo credentials are synced with the current SPATIFY account list.");
    }

    private User ensureSeedUser(String email, String password, String firstName, String lastName, String phone, Role role) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User(email, passwordEncoder.encode(password), firstName, lastName, phone, role);
            user.setVerified(true);
            return userRepository.save(user);
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setRole(role);
        user.setVerified(true);
        return userRepository.save(user);
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
