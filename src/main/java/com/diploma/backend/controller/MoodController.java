package com.diploma.backend.controller;

import com.diploma.backend.Entity.MoodEntry;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.MoodEntryRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/mood")
@RequiredArgsConstructor
public class MoodController {

    private final UserRepository userRepository;
    private final MoodEntryRepository moodRepository;

    // ПОЛУЧИТЬ НАСТРОЕНИЕ НА СЕГОДНЯ
    @GetMapping("/today/{userId}")
    public ResponseEntity<?> getTodayMood(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        // Если настроение было установлено сегодня - возвращаем его
        if (user.getLastMoodDate() != null && user.getLastMoodDate().equals(LocalDate.now())) {
            return ResponseEntity.ok(Map.of("mood", user.getTodayMood()));
        }

        // Иначе возвращаем пустоту
        return ResponseEntity.ok(Map.of("mood", ""));
    }

    // СОХРАНИТЬ НАСТРОЕНИЕ
    @PostMapping("/{userId}")
    public ResponseEntity<?> saveMood(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userId).orElseThrow();
        String mood = payload.get("mood");

        user.setTodayMood(mood);
        user.setLastMoodDate(LocalDate.now());
        userRepository.save(user);

        // Также сохраняем в историю (MoodEntry)
        MoodEntry entry = moodRepository.findByUserIdAndDate(userId, LocalDate.now())
                .orElse(new MoodEntry());
        
        entry.setUser(user);
        entry.setMood(mood);
        entry.setDate(LocalDate.now());
        moodRepository.save(entry);

        return ResponseEntity.ok().build();
    }
}