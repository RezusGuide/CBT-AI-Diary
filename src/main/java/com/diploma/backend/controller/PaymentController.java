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

    // 1. Клиент хочет оплатить -> Создаем заказ
    @PostMapping("/init")
    public ResponseEntity<?> initPayment(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        PaymentTransaction tx = paymentService.createPayment(userId);

        // Возвращаем данные для QR кода
        return ResponseEntity.ok(Map.of(
                "orderId", tx.getOrderId(),
                "amount", tx.getAmount(),
                // Генерируем ссылку для QR (визуально)
                "qrData", "https://kaspi.kz/pay/" + tx.getOrderId()
        ));
    }

    // 2. WEBHOOK (Сюда постучится Kaspi в будущем)
    // Пока что сюда стучится наша кнопка "Симулировать успех"
    @PostMapping("/webhook/success")
    public ResponseEntity<?> webhookSuccess(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("orderId");

        // В будущем здесь будет проверка цифровой подписи (Signature check)
        // if (!isValidSignature(headers, payload)) return 403;

        paymentService.processSuccessWebhook(orderId);

        return ResponseEntity.ok("OK"); // Банку нужно отвечать просто ОК или XML
    }

    // 3. Фронтенд опрашивает этот метод: "Ну что, оплатили?"
    @GetMapping("/check/{orderId}")
    public ResponseEntity<?> checkStatus(@PathVariable String orderId) {
        String status = paymentService.checkStatus(orderId);
        return ResponseEntity.ok(Map.of("status", status));
    }
}