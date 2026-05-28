package com.diploma.backend.repository;

import com.diploma.backend.Entity.DreamEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DreamEntryRepository extends JpaRepository<DreamEntry, Long> {
    List<DreamEntry> findByUser_Id(Long userId);
    List<DreamEntry> findTop3ByUser_IdOrderByCreatedAtDesc(Long userId);
    List<DreamEntry> findAllByUser_IdOrderByCreatedAtDesc(Long userId);
    long countByUser_Id(Long userId);
}
