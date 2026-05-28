package com.diploma.backend.repository;
import com.diploma.backend.Entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByClient_IdOrderByCreatedAtDesc(Long clientId);
    List<Assignment> findByPsychologist_IdOrderByCreatedAtDesc(Long psychId);

    List<Assignment> findByClient_Id(Long userId);

    long countByClient_Id(Long clientId);
}
