package com.diploma.backend.controller;

import com.diploma.backend.repository.AssignmentRepository;
import com.diploma.backend.repository.DiaryEntryRepository;
import com.diploma.backend.repository.DreamEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DiaryEntryRepository diaryEntryRepository;
    private final DreamEntryRepository dreamEntryRepository;
    private final AssignmentRepository assignmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats(@RequestParam Long userId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("diaryCount", diaryEntryRepository.countByUser_Id(userId));
        stats.put("sleepCount", dreamEntryRepository.countByUser_Id(userId));
        stats.put("taskCount", assignmentRepository.countByClient_Id(userId));
        stats.put("adviceCount", 5L); 
        return ResponseEntity.ok(stats);
    }
}
