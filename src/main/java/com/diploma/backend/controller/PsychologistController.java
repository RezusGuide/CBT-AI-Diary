package com.diploma.backend.controller;

import com.diploma.backend.Entity.MoodEntry;
import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.MoodEntryRepository;
import com.diploma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/psychologist")
@RequiredArgsConstructor
public class PsychologistController {

    private final UserRepository userRepository;
    private final MoodEntryRepository moodRepository;

    @GetMapping("/clients/my")
    public List<User> getMyClients(@RequestParam Long psychologistId) {
        return userRepository.findByPsychologistId(psychologistId);
    }

    // Добавим метод, чтобы клиент мог получить список ВСЕХ психологов для выбора
    @GetMapping("/list")
    public List<User> getAllPsychologists() {
        return userRepository.findByRole("PSYCHOLOGIST");
    }

    @GetMapping("/client/{clientId}/mood-history")
    public List<Map<String, String>> getClientMoodHistory(@PathVariable Long clientId) {
        // Берем все записи
        List<MoodEntry> moods = moodRepository.findAll().stream()
                .filter(m -> m.getUser().getId().equals(clientId))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());

        return moods.stream().map(m -> Map.of(
                "date", m.getDate().toString(),
                "mood", m.getMood()
        )).collect(Collectors.toList());
    }
}