package com.diploma.backend.controller;

import com.diploma.backend.Entity.PaymentTransaction;
import com.diploma.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    
    @PostMapping("/init")
    public ResponseEntity<?> initPayment(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        PaymentTransaction tx = paymentService.createPayment(userId);

        
        return ResponseEntity.ok(Map.of(
                "orderId", tx.getOrderId(),
                "amount", tx.getAmount(),
                
                "qrData", "https://kaspi.kz/pay/" + tx.getOrderId()
        ));
    }

    
    
    @PostMapping("/webhook/success")
    public ResponseEntity<?> webhookSuccess(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("orderId");

        
        

        paymentService.processSuccessWebhook(orderId);

        return ResponseEntity.ok("OK"); 
    }

    
    @GetMapping("/check/{orderId}")
    public ResponseEntity<?> checkStatus(@PathVariable String orderId) {
        String status = paymentService.checkStatus(orderId);
        return ResponseEntity.ok(Map.of("status", status));
    }
}