package com.diploma.backend.controller;

import com.diploma.backend.Entity.DreamEntry;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.DreamEntryRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dreams")
@RequiredArgsConstructor
public class DreamController {

    private final DreamEntryRepository dreamRepository;
    private final UserRepository userRepository;
    private final ChatClient.Builder chatClientBuilder;

    @GetMapping
    public List<DreamEntry> getDreams(@RequestParam Long userId) {
        return dreamRepository.findTop3ByUserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/all")
    public List<DreamEntry> getHistory(@RequestParam Long userId) {
        return dreamRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping
    public DreamEntry analyzeDream(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String text = payload.get("text").toString();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatClient chatClient = chatClientBuilder.build();
String promptStr = "Ты - толкователь снов, опирающийся на психологию Юнга и Фрейда, но дающий современные трактовки. " +
        "Проанализируй этот сон: \"" + text + "\". " +
        "Выдели ключевые символы и объясни, что они могут значить для подсознания. Будь краток.";

String interpretation;
try {
    interpretation = chatClient.prompt(new Prompt(promptStr))
            .call()
            .content();
} catch (Exception e) {
            interpretation = "Ошибка интерпретации: " + e.getMessage();
        }

        DreamEntry entry = new DreamEntry();
        entry.setText(text);
        entry.setInterpretation(interpretation);
        entry.setCreatedAt(LocalDateTime.now());
        entry.setUser(user);

        return dreamRepository.save(entry);
    }
    // Добавь это внутрь DreamController.java

    // ПОЛУЧИТЬ СНЫ ПОЛЬЗОВАТЕЛЯ
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DreamEntry>> getUserDreams(@PathVariable Long userId) {
        // Убедись, что в DreamRepository есть метод findByUserId(Long userId)
        return ResponseEntity.ok(dreamRepository.findByUserId(userId));
    }
    // ОБНОВИТЬ СОН
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDream(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            var dream = dreamRepository.findById(id).orElseThrow();

            dream.setText(payload.get("text") != null ? payload.get("text") : payload.get("content"));

            return ResponseEntity.ok(dreamRepository.save(dream));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        }
    }

    // УДАЛИТЬ СОН
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDream(@PathVariable Long id) {
        dreamRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}