package com.diploma.backend.service;

import com.diploma.backend.Entity.PaymentTransaction;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.PaymentRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    
    public PaymentTransaction createPayment(Long userId) {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setUserId(userId);
        tx.setAmount(2000.00); 
        tx.setStatus("PENDING");
        tx.setProvider("KASPI_SIMULATION");
        tx.setOrderId(UUID.randomUUID().toString()); 

        return paymentRepository.save(tx);
    }

    
    
    public void processSuccessWebhook(String orderId) {
        PaymentTransaction tx = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        if ("SUCCESS".equals(tx.getStatus())) {
            return; 
        }

        
        tx.setStatus("SUCCESS");
        tx.setPaidAt(LocalDateTime.now());
        paymentRepository.save(tx);

        
        User user = userRepository.findById(tx.getUserId()).orElseThrow();
        LocalDate now = LocalDate.now();

        
        if (user.getSubscriptionEndsAt() != null && user.getSubscriptionEndsAt().isAfter(now)) {
            user.setSubscriptionEndsAt(user.getSubscriptionEndsAt().plusDays(30));
        } else {
            user.setSubscriptionEndsAt(now.plusDays(30));
        }
        userRepository.save(user);
    }

    
    public String checkStatus(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(PaymentTransaction::getStatus)
                .orElse("NOT_FOUND");
    }
}