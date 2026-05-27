package com.diploma.backend.controller;

import com.diploma.backend.Entity.CalendarEvent;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.CalendarEventRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/psychologist-tools/events")
@RequiredArgsConstructor
public class EventController {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<CalendarEvent>> getEvents(@RequestParam Long psychologistId) {
        return ResponseEntity.ok(calendarEventRepository.findByPsychologistId(psychologistId));
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, String> payload) {
        try {
            CalendarEvent event = new CalendarEvent();
            event.setTitle(payload.get("title"));
            event.setTime(payload.get("time"));
            event.setDate(LocalDate.parse(payload.get("date")));

            // Достаем юзера из базы и привязываем к событию
            Long psychId = Long.valueOf(payload.get("psychologistId"));
            User psych = userRepository.findById(psychId)
                    .orElseThrow(() -> new RuntimeException("Психолог не найден"));
            event.setPsychologist(psych);

            return ResponseEntity.ok(calendarEventRepository.save(event));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка сохранения события: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        calendarEventRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}