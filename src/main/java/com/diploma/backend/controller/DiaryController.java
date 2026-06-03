package com.diploma.backend.controller;

import com.diploma.backend.Entity.DiaryEntry;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.DiaryEntryRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryEntryRepository diaryRepository;
    private final UserRepository userRepository;
    
    @GetMapping
    public List<DiaryEntry> getAllEntries(@RequestParam Long userId) {
        return diaryRepository.findAllByUser_IdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/history")
    public ResponseEntity<List<DiaryEntry>> getHistory(@RequestParam Long userId) {
        return ResponseEntity.ok(diaryRepository.findAllByUser_IdOrderByCreatedAtDesc(userId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DiaryEntry>> getUserEntries(@PathVariable Long userId) {
        return ResponseEntity.ok(diaryRepository.findByUser_Id(userId));
    }

    
    @PostMapping
    public ResponseEntity<?> createDiaryEntry(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());

            
            var entries = diaryRepository.findByUser_Id(userId);

            
            java.time.LocalDate today = java.time.LocalDate.now();
            boolean hasTodayEntry = entries.stream()
                    .anyMatch(e -> e.getCreatedAt().toLocalDate().equals(today));

            if (hasTodayEntry) {
                return ResponseEntity.badRequest().body("Вы уже сделали основную запись сегодня. Вы можете только дополнить её.");
            }

            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            DiaryEntry entry = new DiaryEntry();
            entry.setUser(user); 
            entry.setText((String) payload.get("text"));

            return ResponseEntity.ok(diaryRepository.save(entry));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        }
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiaryEntry(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            var entry = diaryRepository.findById(id).orElseThrow();
            entry.setText(payload.get("text"));
            return ResponseEntity.ok(diaryRepository.save(entry));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiaryEntry(@PathVariable Long id) {
        if (!diaryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        diaryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
