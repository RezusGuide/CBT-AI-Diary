package com.diploma.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "chats")
@Data
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Первый участник (например, Клиент)
    @ManyToOne
    @JoinColumn(name = "participant1_id")
    private User participant1;

    // Второй участник (например, Психолог)
    @ManyToOne
    @JoinColumn(name = "participant2_id")
    private User participant2;

    // Чтобы показывать в списке чатов последнее сообщение
    private String lastMessage;

    private LocalDateTime lastMessageTime;
}