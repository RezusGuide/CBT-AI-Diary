package com.diploma.backend.repository;

import com.diploma.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByPsychologistId(Long psychologistId);

    List<User> findByRole(String role);

    Optional<User> findByUsername(String username);

    List<User> findByRoleAndFullNameContainingIgnoreCase(String role, String namePart);

    List<User> findAllByRole(String role);
}