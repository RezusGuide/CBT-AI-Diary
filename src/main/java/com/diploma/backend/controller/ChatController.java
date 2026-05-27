package com.diploma.backend.controller;

import com.diploma.backend.Entity.Chat;
import com.diploma.backend.Entity.ChatMessage;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.ChatMessageRepository;
import com.diploma.backend.repository.ChatRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository; // ДОБАВИЛИ РЕПОЗИТОРИЙ

    // 1. ПОЛУЧИТЬ ВСЕ ЧАТЫ ПОЛЬЗОВАТЕЛЯ
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Chat>> getUserChats(@PathVariable Long userId) {
        return ResponseEntity.ok(chatRepository.findByParticipantId(userId));
    }

    // 2. СОЗДАТЬ ЧАТ
    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestParam Long userId, @RequestParam Long targetId) {
        Optional<Chat> existingChat = chatRepository.findExistingChat(userId, targetId);
        if (existingChat.isPresent()) {
            return ResponseEntity.ok(existingChat.get());
        }

        User user1 = userRepository.findById(userId).orElseThrow();
        User user2 = userRepository.findById(targetId).orElseThrow();

        Chat chat = new Chat();
        chat.setParticipant1(user1);
        chat.setParticipant2(user2);
        chat.setLastMessage("Чат создан");
        chat.setLastMessageTime(LocalDateTime.now());

        chatRepository.save(chat);
        return ResponseEntity.ok(chat);
    }

    // --- НОВЫЕ МЕТОДЫ (ИСПРАВЛЯЮТ ОШИБКУ 404) ---

    // 3. ОТПРАВИТЬ СООБЩЕНИЕ
    @PostMapping("/message")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody MessageRequest request) {
        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new RuntimeException("Чат не найден"));

        // Создаем сообщение
        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSenderId(request.getSenderId());
        message.setContent(request.getContent());
        message.setTimestamp(LocalDateTime.now());

        chatMessageRepository.save(message);

        // Обновляем "последнее сообщение" в самом чате (чтобы в списке было видно)
        chat.setLastMessage(request.getContent());
        chat.setLastMessageTime(LocalDateTime.now());
        chatRepository.save(chat);

        return ResponseEntity.ok(message);
    }

    // 4. ПОЛУЧИТЬ ИСТОРИЮ СООБЩЕНИЙ
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatMessageRepository.findByChatId(chatId));
    }

    // Вспомогательный класс для приема данных (DTO)
    @Data
    public static class MessageRequest {
        private Long chatId;
        private Long senderId;
        private String content;
    }
}