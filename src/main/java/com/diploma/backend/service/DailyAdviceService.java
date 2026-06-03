package com.diploma.backend.service;

import com.diploma.backend.Entity.DiaryEntry;
import com.diploma.backend.Entity.MoodEntry;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.DiaryEntryRepository;
import com.diploma.backend.repository.MoodEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DailyAdviceService {

    private final CbtAiService cbtAiService;
    private final DiaryEntryRepository diaryRepository;
    private final MoodEntryRepository moodRepository;

    public DailyAdviceService(CbtAiService cbtAiService,
                               DiaryEntryRepository diaryRepository,
                               MoodEntryRepository moodRepository) {
        this.cbtAiService = cbtAiService;
        this.diaryRepository = diaryRepository;
        this.moodRepository = moodRepository;
    }

    public String generateDailyAdvice(User user) {
        List<DiaryEntry> recentEntries = diaryRepository
            .findAllByUser_IdOrderByCreatedAtDesc(user.getId())
            .stream()
            .limit(3)
            .collect(Collectors.toList());

        StringBuilder context = new StringBuilder();
        context.append("Контекст о пользователе:\n");

        if (!recentEntries.isEmpty()) {
            context.append("Последние записи в дневнике:\n");
            recentEntries.forEach(e -> {
                if (e.getText() != null && !e.getText().isBlank()) {
                    context.append("- ").append(e.getText(), 0,
                        Math.min(200, e.getText().length())).append("...\n");
                }
            });
        } else {
            context.append("Пользователь только начинает вести дневник.\n");
        }

        String request = "Дай один персонализированный КПТ-совет на сегодня. " +
            "Короткий (2-3 предложения) и практичный. " +
            "Можно предложить конкретное упражнение на день.";

        return cbtAiService.ask(request, context.toString());
    }
}
