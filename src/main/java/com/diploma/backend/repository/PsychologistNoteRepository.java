package com.diploma.backend.repository;
import com.diploma.backend.Entity.PsychologistNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PsychologistNoteRepository extends JpaRepository<PsychologistNote, Long> {
    List<PsychologistNote> findByPsychologistIdOrderByCreatedAtDesc(Long psychologistId);
}