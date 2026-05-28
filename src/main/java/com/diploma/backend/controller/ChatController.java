package com.diploma.backend.controller;

import com.diploma.backend.Entity.ChatMessage;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.ChatMessageRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    // Get conversation history between two users
    @GetMapping("/messages/{partnerId}")
    public ResponseEntity<List<ChatMessage>> getMessages(
            @PathVariable Long partnerId,
            @RequestParam Long userId) {
        List<ChatMessage> messages = chatMessageRepository
            .findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
                userId, partnerId, partnerId, userId
            );
        return ResponseEntity.ok(messages);
    }

    // Send a message
    @PostMapping("/messages/{receiverId}")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long receiverId,
            @RequestParam Long senderId,
            @RequestBody Map<String, String> body) {
        
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        
        if (!canChat(sender, receiver)) {
            return ResponseEntity.status(403).build();
        }
        
        ChatMessage msg = new ChatMessage();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(body.get("content"));
        msg.setSentAt(LocalDateTime.now());
        
        return ResponseEntity.ok(chatMessageRepository.save(msg));
    }

    // Get the chat partner for a CLIENT (their psychologist)
    // or list of clients for a PSYCHOLOGIST
    @GetMapping("/partner")
    public ResponseEntity<?> getChatPartner(@RequestParam Long userId) {
        User me = userRepository.findById(userId).orElseThrow();
        if ("CLIENT".equals(me.getRole())) {
            if (me.getPsychologist() == null) return ResponseEntity.ok(Map.of("partner", null));
            return ResponseEntity.ok(Map.of("partner", me.getPsychologist()));
        } else {
            return ResponseEntity.ok(Map.of("clients", me.getClients()));
        }
    }

    private boolean canChat(User a, User b) {
        // client->psychologist or psychologist->client
        if ("CLIENT".equals(a.getRole()) && "PSYCHOLOGIST".equals(b.getRole()))
            return b.equals(a.getPsychologist());
        if ("PSYCHOLOGIST".equals(a.getRole()) && "CLIENT".equals(b.getRole()))
            return a.equals(b.getPsychologist());
        return false;
    }
}
