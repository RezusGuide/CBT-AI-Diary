package com.diploma.backend.controller;

import com.diploma.backend.repository.DiaryEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {
    private final UserRepository userRepository;
    private final DiaryEntryRepository diaryRepository;

    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getInnerWorldStatus(@PathVariable Long userId) {
        try {
            // Считаем количество записей в дневнике у этого пользователя
            // (В будущем можно считать уникальные дни, но для начала просто количество записей)
            long entriesCount = diaryRepository.findByUser_Id(userId).size();

            int requiredDays = 5;
            boolean isUnlocked = entriesCount >= requiredDays;

            return ResponseEntity.ok(Map.of(
                    "daysLogged", entriesCount,
                    "requiredDays", requiredDays,
                    "isUnlocked", isUnlocked
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ошибка проверки статуса"));
        }
    }
    @GetMapping("/world-state/{userId}")
    public ResponseEntity<?> getWorldState(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow();
            String currentMood = user.getTodayMood();

            int moodScore = 5; // По умолчанию нейтральное

            // Простая конвертация настроения в баллы (для погоды в игре)
            if (currentMood != null && !currentMood.isEmpty()) {
                switch(currentMood) {
                    case "joy": case "happy": case "excited": moodScore = 8; break;
                    case "sad": case "depressed": case "down": moodScore = 3; break;
                    case "annoyed": case "surprised": moodScore = 4; break;
                    default: moodScore = 6;
                }
            }

            // Чем хуже настроение, тем больше сорняков появляется (от 0 до 7)
            int weedsCount = Math.max(0, 10 - moodScore);

            return ResponseEntity.ok(Map.of(
                    "moodScore", moodScore,
                    "weedsCount", weedsCount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ошибка загрузки мира"));
        }
    }
}