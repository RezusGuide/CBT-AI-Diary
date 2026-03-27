package com.diploma.backend.controller;

import com.diploma.backend.Entity.Assignment;
import com.diploma.backend.repository.AssignmentRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    // Психолог создает задание
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            Assignment a = new Assignment();
            a.setTitle((String) payload.get("title"));
            a.setDescription((String) payload.get("description"));
            
            Long psychId = Long.valueOf(payload.get("psychologistId").toString());
            Long clientId = Long.valueOf(payload.get("clientId").toString());
            
            a.setPsychologist(userRepository.findById(psychId)
                    .orElseThrow(() -> new RuntimeException("Психолог не найден")));
            a.setClient(userRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Клиент не найден")));
            
            return ResponseEntity.ok(assignmentRepository.save(a));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при создании задания: " + e.getMessage());
        }
    }

    // Клиент получает свои задания
    @GetMapping("/client/{id}")
    public List<Assignment> getForClient(@PathVariable Long id) {
        return assignmentRepository.findByClientIdOrderByCreatedAtDesc(id);
    }

    @GetMapping("/psychologist/{id}")
    public List<Assignment> getForPsychologist(@PathVariable Long id) {
        return assignmentRepository.findByPsychologistIdOrderByCreatedAtDesc(id);
    }

    // Клиент отвечает на задание
    @PutMapping("/{id}/complete")
    public Assignment complete(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Assignment a = assignmentRepository.findById(id).orElseThrow();
        a.setClientAnswer(payload.get("answer"));
        a.setCompleted(true);
        return assignmentRepository.save(a);
    }
    // Добавь это внутрь AssignmentController.java

    // ПОЛУЧИТЬ ЗАДАНИЯ КЛИЕНТА
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Assignment>> getClientAssignments(@PathVariable Long userId) {
        // Убедись, что в AssignmentRepository есть метод findByClientId(Long clientId)
        // Имя метода зависит от того, как у тебя называется поле связи с клиентом в сущности Assignment
        return ResponseEntity.ok(assignmentRepository.findByClientId(userId));
    }

    // ОБНОВИТЬ (РЕДАКТИРОВАТЬ) ЗАДАНИЕ
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Assignment assignment = assignmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Задание не найдено"));

            // Обновляем только заголовок и описание
            assignment.setTitle(payload.get("title"));
            assignment.setDescription(payload.get("description"));

            return ResponseEntity.ok(assignmentRepository.save(assignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при обновлении задания: " + e.getMessage());
        }
    }

    // УДАЛИТЬ ЗАДАНИЕ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            assignmentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при удалении: " + e.getMessage());
        }
    }
}