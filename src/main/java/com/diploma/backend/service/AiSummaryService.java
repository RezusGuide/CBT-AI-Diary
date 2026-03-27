package com.diploma.backend.service;

import com.diploma.backend.Entity.DiaryEntry;
import com.diploma.backend.Entity.MoodEntry;
import com.diploma.backend.repository.DiaryEntryRepository;
import com.diploma.backend.repository.MoodEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiSummaryService {

    private final ChatClient.Builder chatClientBuilder;
    private final DiaryEntryRepository diaryRepository;
    private final MoodEntryRepository moodRepository;

    public String generateClientSummary(Long clientId) {
        ChatClient chatClient = chatClientBuilder.build();

        // 1. Собираем данные за последние 7-10 дней
        List<DiaryEntry> recentDiaries = diaryRepository.findByUser_Id(clientId); // В идеале ограничить по дате
        List<MoodEntry> recentMoods = moodRepository.findByUserIdOrderByDateDesc(clientId);

        String diaryContext = recentDiaries.stream()
                .limit(10) // Последние 10 записей
                .map(d -> "[" + d.getCreatedAt() + "]: " + d.getText())
                .collect(Collectors.joining("\n"));

        String moodContext = recentMoods.stream()
                .limit(10)
                .map(m -> "[" + m.getDate() + "]: " + m.getMood())
                .collect(Collectors.joining(", "));

        // 2. Формируем промпт
        String systemPrompt = """
                Ты - ассистент профессионального психолога. Твоя задача - проанализировать данные клиента за последнюю неделю 
                и составить краткий отчет (Clinical Summary) для подготовки к сессии.
                
                Отчет должен содержать:
                1. Общий эмоциональный фон.
                2. Ключевые темы и события, которые волновали клиента.
                3. Возможные "красные флаги" или темы для обсуждения на сессии.
                
                Будь профессионален, лаконичен и используй психологическую терминологию.
                """;

        String userPrompt = String.format("""
                Данные клиента:
                
                История настроения:
                %s
                
                Записи в дневнике:
                %s
                """, moodContext, diaryContext);

        try {
            Prompt prompt = new Prompt(List.of(
                new SystemMessage(systemPrompt),
                new UserMessage(userPrompt)
            ));
            return chatClient.prompt(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            return "Ошибка генерации сводки: " + e.getMessage() + ". (Проверьте API ключ в настройках)";
        }
    }
}
