package com.diploma.backend.service;

import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class TwoFactorService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.2fa.otp-expiry-minutes:10}")
    private int otpExpiryMinutes;

    public TwoFactorService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void sendOtp(User user) {
        String otp = String.format("%06d", new SecureRandom().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        userRepository.save(user);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(user.getEmail());
        msg.setSubject("CBT AI Diary — Код подтверждения");
        msg.setText("Ваш код: " + otp + "\nДействителен " + otpExpiryMinutes + " минут.");
        mailSender.send(msg);
    }

    public boolean verifyOtp(User user, String inputOtp) {
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) return false;
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) return false;
        boolean valid = user.getOtpCode().equals(inputOtp.trim());
        if (valid) {
            user.setOtpCode(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
        }
        return valid;
    }
}
