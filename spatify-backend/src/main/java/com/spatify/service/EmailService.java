package com.spatify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(toEmail);
            message.setSubject("Your Spatify Verification Code");
            message.setText("Welcome to Spatify!\n\n" +
                    "Your 6-digit verification code is: " + otpCode + "\n\n" +
                    "This code will expire in 15 minutes.\n" +
                    "If you did not request this, please ignore this email.\n\n" +
                    "Best regards,\nThe Spatify Team");

            mailSender.send(message);
            System.out.println("✅ Real email successfully sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send real email to " + toEmail + ". Error: " + e.getMessage());
            // Fallback to console print if SMTP fails
            System.out.println("==================================================");
            System.out.println("✉️ (FALLBACK) SIMULATED EMAIL SENT TO: " + toEmail);
            System.out.println("🔐 YOUR OTP CODE IS: " + otpCode);
            System.out.println("==================================================");
        }
    }
}
