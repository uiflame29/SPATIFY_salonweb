package com.spatify.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "payroll")
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "otpCode", "seedPhraseHash"})
    private User staff;

    private LocalDate cutoffStart;
    private LocalDate cutoffEnd;
    
    private double hoursWorked;
    private double hourlyRate;
    private double grossPay;
    private double deductions;
    private double netPay;
    
    private String status; // PENDING, PROCESSED, PAID

    private LocalDateTime createdAt = LocalDateTime.now();

    public Payroll() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getStaff() { return staff; }
    public void setStaff(User staff) { this.staff = staff; }
    public LocalDate getCutoffStart() { return cutoffStart; }
    public void setCutoffStart(LocalDate cutoffStart) { this.cutoffStart = cutoffStart; }
    public LocalDate getCutoffEnd() { return cutoffEnd; }
    public void setCutoffEnd(LocalDate cutoffEnd) { this.cutoffEnd = cutoffEnd; }
    public double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(double hoursWorked) { this.hoursWorked = hoursWorked; }
    public double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(double hourlyRate) { this.hourlyRate = hourlyRate; }
    public double getGrossPay() { return grossPay; }
    public void setGrossPay(double grossPay) { this.grossPay = grossPay; }
    public double getDeductions() { return deductions; }
    public void setDeductions(double deductions) { this.deductions = deductions; }
    public double getNetPay() { return netPay; }
    public void setNetPay(double netPay) { this.netPay = netPay; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
