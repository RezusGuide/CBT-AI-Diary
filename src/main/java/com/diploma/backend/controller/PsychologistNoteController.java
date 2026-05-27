package com.diploma.backend.controller;

import com.diploma.backend.Entity.PsychologistNote;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.PsychologistNoteRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/psychologist-tools/notes")
@RequiredArgsConstructor
public class PsychologistNoteController {

    private final PsychologistNoteRepository noteRepository;
    private final UserRepository userRepository;

    // 1. ПОЛУЧИТЬ ВСЕ ЗАМЕТКИ ПСИХОЛОГА
    @GetMapping
    public ResponseEntity<List<PsychologistNote>> getNotes(@RequestParam Long psychologistId) {
        return ResponseEntity.ok(noteRepository.findByPsychologistIdOrderByCreatedAtDesc(psychologistId));
    }

    // 2. СОЗДАТЬ НОВУЮ ЗАМЕТКУ
    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody Map<String, Object> payload) {
        try {
            PsychologistNote note = new PsychologistNote();
            note.setTitle((String) payload.get("title"));
            note.setContent((String) payload.get("content"));

            // Привязываем психолога
            Long psychId = Long.valueOf(payload.get("psychologistId").toString());
            User psych = userRepository.findById(psychId)
                    .orElseThrow(() -> new RuntimeException("Психолог не найден"));
            note.setPsychologist(psych);

            // Привязываем клиента (если он выбран)
            Object clientIdObj = payload.get("clientId");
            if (clientIdObj != null && !clientIdObj.toString().trim().isEmpty()) {
                Long clientId = Long.valueOf(clientIdObj.toString());
                User client = userRepository.findById(clientId).orElse(null);
                note.setClient(client);
            }

            return ResponseEntity.ok(noteRepository.save(note));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при создании заметки: " + e.getMessage());
        }
    }

    // 3. ОБНОВИТЬ СУЩЕСТВУЮЩУЮ ЗАМЕТКУ
    @PutMapping("/{id}")
    public ResponseEntity<PsychologistNote> updateNote(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        PsychologistNote note = noteRepository.findById(id).orElseThrow();
        note.setTitle(payload.get("title"));
        note.setContent(payload.get("content"));
        return ResponseEntity.ok(noteRepository.save(note));
    }

    // 4. УДАЛИТЬ ЗАМЕТКУ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}