package com.diploma.backend.repository;

import com.diploma.backend.Entity.DreamEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DreamEntryRepository extends JpaRepository<DreamEntry, Long> {
    List<DreamEntry> findTop3ByUserIdOrderByCreatedAtDesc(Long userId);
    List<DreamEntry> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<DreamEntry> findByUserId(Long userId);
}