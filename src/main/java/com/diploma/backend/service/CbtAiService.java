package com.diploma.backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CbtAiService {

    private final ChatClient chatClient;

    private static final String CBT_SYSTEM_PROMPT = """
        Ты — тёплый, поддерживающий ИИ-ассистент в приложении для КПТ (когнитивно-поведенческой терапии).
        
        Твои задачи:
        - Помогать пользователям замечать когнитивные искажения в их мыслях
        - Предлагать мягкие рефреймы и альтернативные взгляды на ситуацию
        - Давать практические упражнения из КПТ
        - Поддерживать эмоционально, но не заменять профессионального психолога
        
        Когнитивные искажения которые ты отслеживаешь:
        катастрофизация, чёрно-белое мышление, чтение мыслей, предсказание будущего,
        персонализация, долженствование, эмоциональное обоснование, обесценивание позитивного,
        сверхобобщение, избирательное абстрагирование.
        
        Правила ответов:
        - Отвечай на языке пользователя (русский/английский/казахский)
        - Будь кратким: 3-5 предложений если не просят развёрнуто
        - Никогда не ставь диагнозы
        - Всегда в конце напоминай что живой психолог важнее ИИ
        - Тон: тёплый, без осуждения, как хороший друг с психологическим образованием
        """;

    public CbtAiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String ask(String userMessage) {
        return ask(userMessage, null);
    }

    public String ask(String userMessage, String additionalContext) {
        String fullUserMessage = additionalContext != null
            ? additionalContext + "\n\n" + userMessage
            : userMessage;

        Prompt prompt = new Prompt(List.of(
            new SystemMessage(CBT_SYSTEM_PROMPT),
            new UserMessage(fullUserMessage)
        ));

        try {
            return chatClient.prompt(prompt)
                .call()
                .content();
        } catch (Exception e) {
            return getFallbackResponse();
        }
    }

    private String getFallbackResponse() {
        return "Сейчас ИИ-ассистент временно недоступен. " +
               "Попробуйте написать о своих мыслях в дневник — " +
               "это само по себе отличная КПТ-практика.";
    }
}
