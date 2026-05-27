package com.diploma.backend.repository;
import com.diploma.backend.Entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByPsychologistId(Long psychologistId);
}