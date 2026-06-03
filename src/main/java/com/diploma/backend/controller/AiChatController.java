package com.diploma.backend.controller;

import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.DiaryEntryRepository;
import com.diploma.backend.repository.MoodEntryRepository;
import com.diploma.backend.repository.UserRepository;
import com.diploma.backend.service.CbtAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {

    private final CbtAiService cbtAiService;
    private final UserRepository userRepository;
    private final DiaryEntryRepository diaryRepository;
    private final MoodEntryRepository moodRepository;

    public AiChatController(CbtAiService cbtAiService,
                             UserRepository userRepository,
                             DiaryEntryRepository diaryRepository,
                             MoodEntryRepository moodRepository) {
        this.cbtAiService = cbtAiService;
        this.userRepository = userRepository;
        this.diaryRepository = diaryRepository;
        this.moodRepository = moodRepository;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        String message = body.get("message");
        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is empty"));
        }

        Long userId = getUserId(userDetails);

        String context = buildUserContext(userId);
        String response = cbtAiService.ask(message, context);

        return ResponseEntity.ok(Map.of("response", response));
    }

    @PostMapping("/analyze-diary")
    public ResponseEntity<Map<String, String>> analyzeDiary(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        String content = body.get("content");
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Content is empty"));
        }

        String request = String.format("""
            Запись из КПТ-дневника: "%s"
            
            Коротко (3-4 предложения):
            1. Замеченные эмоции
            2. Когнитивные искажения если есть
            3. Мягкий рефрейм
            """, content);

        String response = cbtAiService.ask(request);
        return ResponseEntity.ok(Map.of("analysis", response));
    }

    @PostMapping("/analyze-dream")
    public ResponseEntity<Map<String, String>> analyzeDream(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        String content = body.get("content");
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Content is empty"));
        }

        String request = String.format("""
            Сон пользователя: "%s"
            
            Дай краткую психологическую интерпретацию (2-3 предложения).
            Только КПТ-подход, без мистики.
            """, content);

        String response = cbtAiService.ask(request);
        return ResponseEntity.ok(Map.of("analysis", response));
    }

    @GetMapping("/daily-advice")
    public ResponseEntity<Map<String, String>> getDailyAdvice(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        String context = buildUserContext(userId);

        String request = "Дай один практичный КПТ-совет на сегодня (2-3 предложения).";
        String advice = cbtAiService.ask(request, context);

        return ResponseEntity.ok(Map.of("advice", advice));
    }

    @PostMapping("/cbt-exercise")
    public ResponseEntity<Map<String, String>> getCbtExercise(
            @RequestBody Map<String, String> body) {

        String mood = body.getOrDefault("mood", "тревога");

        String request = String.format("""
            Предложи одно конкретное КПТ-упражнение для состояния: %s.
            Формат:
            Название упражнения: ...
            Как выполнять: (3-4 шага)
            Время: ... минут
            """, mood);

        String exercise = cbtAiService.ask(request);
        return ResponseEntity.ok(Map.of("exercise", exercise));
    }

    private String buildUserContext(Long userId) {
        var entries = diaryRepository.findAllByUser_IdOrderByCreatedAtDesc(userId);
        if (entries.isEmpty()) return "";

        String recentDiary = entries.stream()
            .limit(3)
            .filter(e -> e.getText() != null)
            .map(e -> "- " + e.getText().substring(0, Math.min(150, e.getText().length())))
            .collect(Collectors.joining("\n"));

        if (recentDiary.isBlank()) return "";
        return "Последние записи пользователя в дневнике:\n" + recentDiary + "\n\n";
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
            .map(User::getId)
            .orElseThrow();
    }
}
