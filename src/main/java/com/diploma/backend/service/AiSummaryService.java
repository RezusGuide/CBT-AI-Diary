package com.diploma.backend.service;

import com.diploma.backend.Entity.DiaryEntry;
import com.diploma.backend.Entity.MoodEntry;
import com.diploma.backend.repository.DiaryEntryRepository;
import com.diploma.backend.repository.MoodEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiSummaryService {

    private final CbtAiService cbtAiService;
    private final DiaryEntryRepository diaryRepository;
    private final MoodEntryRepository moodRepository;

    public AiSummaryService(CbtAiService cbtAiService, 
                            DiaryEntryRepository diaryRepository,
                            MoodEntryRepository moodRepository) {
        this.cbtAiService = cbtAiService;
        this.diaryRepository = diaryRepository;
        this.moodRepository = moodRepository;
    }

    public String analyzeDiaryEntry(DiaryEntry entry) {
        if (entry.getText() == null || entry.getText().isBlank()) {
            return null;
        }

        String request = String.format("""
            Проанализируй эту запись из КПТ-дневника:
            
            "%s"
            
            Ответь в формате:
            1. Какие эмоции ты замечаешь? (1 предложение)
            2. Есть ли когнитивные искажения? Назови если есть (1-2 искажения максимум)
            3. Мягкий рефрейм или альтернативная мысль (1-2 предложения)
            
            Будь кратким и поддерживающим.
            """, entry.getText());

        return cbtAiService.ask(request);
    }

    public String analyzeDream(String dreamContent) {
        if (dreamContent == null || dreamContent.isBlank()) {
            return null;
        }

        String request = String.format("""
            Пользователь описал сон:
            "%s"
            
            Дай краткую КПТ-интерпретацию (2-3 предложения):
            - Какие эмоции или темы могут отражать этот сон?
            - Есть ли связь с дневными переживаниями?
            Не давай мистических интерпретаций, только психологические.
            """, dreamContent);

        return cbtAiService.ask(request);
    }

    public String generateClientSummary(Long clientId) {
        List<DiaryEntry> recentDiaries = diaryRepository.findAllByUser_IdOrderByCreatedAtDesc(clientId);
        List<MoodEntry> recentMoods = moodRepository.findByUser_IdOrderByDateDesc(clientId);

        String diaryContext = recentDiaries.stream()
                .limit(10)
                .map(d -> "[" + d.getCreatedAt() + "]: " + d.getText())
                .collect(Collectors.joining("\n"));

        String moodContext = recentMoods.stream()
                .limit(10)
                .map(m -> "[" + m.getDate() + "]: " + m.getMood())
                .collect(Collectors.joining(", "));

        String request = String.format("""
                Ты - ассистент профессионального психолога. Твоя задача - проанализировать данные клиента за последнюю неделю 
                и составить краткий отчет (Clinical Summary) для подготовки к сессии.
                
                Данные клиента:
                
                История настроения:
                %s
                
                Записи в дневнике:
                %s
                
                Отчет должен содержать:
                1. Общий эмоциональный фон.
                2. Ключевые темы и события, которые волновали клиента.
                3. Возможные "красные флаги" или темы для обсуждения на сессии.
                
                Будь профессионален, лаконичен и используй психологическую терминологию.
                """, moodContext, diaryContext);

        return cbtAiService.ask(request);
    }
}
