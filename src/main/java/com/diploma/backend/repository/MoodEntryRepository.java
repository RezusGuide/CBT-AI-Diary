package com.diploma.backend.repository;

import com.diploma.backend.Entity.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {
    Optional<MoodEntry> findByUserIdAndDate(Long userId, LocalDate date);
}