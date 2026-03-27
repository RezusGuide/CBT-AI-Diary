package com.diploma.backend.controller;

import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private static final String UPLOAD_DIR = "uploads/";
    @PostMapping("/{id}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());
            String fileUrl = "/uploads/" + fileName;
            user.setPhotoUrl(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok(user); // Возвращаем обновленного юзера

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Ошибка загрузки файла");
        }
    }
    @GetMapping("/psychologists")
    public ResponseEntity<List<User>> getPsychologists() {
        List<User> psychologists = userRepository.findAllByRole("PSYCHOLOGIST");
        return ResponseEntity.ok(psychologists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/{clientId}/select-psychologist/{psychId}")
    public ResponseEntity<?> selectPsychologist(@PathVariable Long clientId, @PathVariable Long psychId) {
        try {
            User client = userRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Клиент не найден"));
            User psychologist = userRepository.findById(psychId)
                    .orElseThrow(() -> new RuntimeException("Психолог не найден"));
            client.setPsychologist(psychologist);
            userRepository.save(client);
            return ResponseEntity.ok(client);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при выборе психолога: " + e.getMessage());
        }
    }
}