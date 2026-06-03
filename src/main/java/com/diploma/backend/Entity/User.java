package com.diploma.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    private String email;
    private String password;
    private String role;

    private String fullName;
    private String phone;
    private String birthDate;
    private String todayMood;
    private java.time.LocalDate lastMoodDate;


    
    private String specialization;
    private Integer experience;

    @Column(columnDefinition = "TEXT")
    private String certificateUrls;

    @Column(columnDefinition = "TEXT")
    private String socialLinks;

    @Column(length = 1000) 
    private String aboutMe;

    @Column(columnDefinition = "TEXT")
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String profilePicture; 

    private String currentTheme;

    @ManyToOne
    @JoinColumn(name = "psychologist_id")
    @JsonIgnoreProperties({"password", "certificateUrls", "photoUrl", "aboutMe", "clients"}) 
    private User psychologist;

    @OneToMany(mappedBy = "psychologist")
    @JsonIgnoreProperties({"psychologist", "password"})
    private java.util.List<User> clients = new java.util.ArrayList<>();

    private java.time.LocalDate subscriptionEndsAt;

    private boolean twoFactorEnabled = false;

    @Column(name = "otp_code")
    private String otpCode;



    @Column(name = "otp_expiry")
    private java.time.LocalDateTime otpExpiry;
}
