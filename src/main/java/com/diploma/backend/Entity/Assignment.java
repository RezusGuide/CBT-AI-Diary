package com.diploma.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // Заголовок (например "Дневник эмоций")
    @Column(columnDefinition = "TEXT")
    private String description; // Описание задания

    @Column(columnDefinition = "TEXT")
    private String clientAnswer; // Ответ клиента

    private boolean completed = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JsonIgnoreProperties("password")
    private User psychologist;

    @ManyToOne
    @JsonIgnoreProperties("password")
    private User client;
}