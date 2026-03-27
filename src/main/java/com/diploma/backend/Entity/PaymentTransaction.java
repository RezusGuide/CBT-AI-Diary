package com.diploma.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;            // Кто платил
    private Double amount;          // Сколько (2000.00)
    private String status;          // PENDING, SUCCESS, FAILED
    private String provider;        // KASPI, FREEDOM

    // Внутренний ID заказа, который мы шлем в банк
    private String orderId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;
}