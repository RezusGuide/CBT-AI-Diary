package com.diploma.backend.controller;

import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Пользователь уже существует"));
        }
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("CLIENT");
        }
        user.setSubscriptionEndsAt(LocalDate.now().plusDays(30));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Регистрация успешна"));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        // Простая проверка пароля (для диплома пойдет, в продакшене нужен BCrypt)
        if (userOptional.isEmpty() || !userOptional.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Неверный логин или пароль"));
        }

        User user = userOptional.get();

        // ВАЖНО: Возвращаем ВЕСЬ объект пользователя,
        // чтобы фронтенд получил fullName, subscriptionEndsAt, email и т.д.
        return ResponseEntity.ok(user);
    }
}