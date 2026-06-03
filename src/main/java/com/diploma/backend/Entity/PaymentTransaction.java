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

    private Long userId;            
    private Double amount;          
    private String status;          
    private String provider;        

    
    private String orderId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;
}