package com.diploma.backend.repository;

import com.diploma.backend.Entity.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {

    // 1. Для проверки, писал ли юзер сегодня
    List<DiaryEntry> findByUser_Id(Long userId);

    // 2. Для вывода всех записей с сортировкой по дате
    List<DiaryEntry> findAllByUser_IdOrderByCreatedAtDesc(Long userId);
}