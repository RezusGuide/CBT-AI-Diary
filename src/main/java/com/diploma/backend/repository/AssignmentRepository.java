package com.diploma.backend.repository;
import com.diploma.backend.Entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByClientIdOrderByCreatedAtDesc(Long clientId);
    List<Assignment> findByPsychologistIdOrderByCreatedAtDesc(Long psychId);

    List<Assignment> findByClientId(Long userId);
}