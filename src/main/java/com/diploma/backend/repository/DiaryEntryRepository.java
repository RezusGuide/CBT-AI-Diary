package com.diploma.backend.repository;

import com.diploma.backend.Entity.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {

    
    List<DiaryEntry> findByUser_Id(Long userId);

    
    List<DiaryEntry> findAllByUser_IdOrderByCreatedAtDesc(Long userId);

    long countByUser_Id(Long userId);
}
