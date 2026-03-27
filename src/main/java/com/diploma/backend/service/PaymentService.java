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

    // 1. Создание заказа (То, что происходит, когда клиент жмет "Оплатить")
    public PaymentTransaction createPayment(Long userId) {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setUserId(userId);
        tx.setAmount(2000.00); // 2000 тенге
        tx.setStatus("PENDING");
        tx.setProvider("KASPI_SIMULATION");
        tx.setOrderId(UUID.randomUUID().toString()); // Уникальный номер заказа

        return paymentRepository.save(tx);
    }

    // 2. Обработка успешной оплаты (Webhook)
    // Этот метод будет вызываться Банком (или нашей симуляцией)
    public void processSuccessWebhook(String orderId) {
        PaymentTransaction tx = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        if ("SUCCESS".equals(tx.getStatus())) {
            return; // Уже оплачено, защиту от дублей
        }

        // 1. Обновляем статус транзакции
        tx.setStatus("SUCCESS");
        tx.setPaidAt(LocalDateTime.now());
        paymentRepository.save(tx);

        // 2. Продлеваем подписку пользователю
        User user = userRepository.findById(tx.getUserId()).orElseThrow();
        LocalDate now = LocalDate.now();

        // Логика продления
        if (user.getSubscriptionEndsAt() != null && user.getSubscriptionEndsAt().isAfter(now)) {
            user.setSubscriptionEndsAt(user.getSubscriptionEndsAt().plusDays(30));
        } else {
            user.setSubscriptionEndsAt(now.plusDays(30));
        }
        userRepository.save(user);
    }

    // Проверка статуса (для фронтенда, который ждет оплаты)
    public String checkStatus(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(PaymentTransaction::getStatus)
                .orElse("NOT_FOUND");
    }
}