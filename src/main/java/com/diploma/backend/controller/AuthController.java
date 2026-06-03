package com.diploma.backend.controller;

import com.diploma.backend.Entity.User;
import com.diploma.backend.repository.UserRepository;
import com.diploma.backend.security.JwtUtil;
import com.diploma.backend.service.TwoFactorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TwoFactorService twoFactorService;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil,
                          UserRepository userRepository, PasswordEncoder passwordEncoder,
                          TwoFactorService twoFactorService) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.twoFactorService = twoFactorService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String role     = body.get("role");
        String email    = body.get("email");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role != null ? role.toUpperCase() : "CLIENT");
        user.setEmail(email);
        userRepository.save(user);

        String access  = jwtUtil.generateAccessToken(username, user.getRole());
        String refresh = jwtUtil.generateRefreshToken(username);
        return ResponseEntity.ok(Map.of("accessToken", access, "refreshToken", refresh,
                                        "role", user.getRole(), "userId", user.getId(),
                                        "requires2fa", false));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.get("username"), body.get("password"))
            );

            User user = userRepository.findByUsername(auth.getName()).orElseThrow();

            if (user.isTwoFactorEnabled()) {
                if (user.getEmail() == null || user.getEmail().isBlank()) {
                    return ResponseEntity.badRequest().body(Map.of("error",
                        "2FA is enabled but no email is set. Contact support."));
                }
                twoFactorService.sendOtp(user);
                return ResponseEntity.ok(Map.of(
                    "requires2fa", true,
                    "userId", user.getId()
                ));
            }

            String access  = jwtUtil.generateAccessToken(user.getUsername(), user.getRole());
            String refresh = jwtUtil.generateRefreshToken(user.getUsername());
            return ResponseEntity.ok(Map.of(
                "accessToken", access, "refreshToken", refresh,
                "role", user.getRole(), "userId", user.getId(),
                "requires2fa", false
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2fa(@RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(body.get("userId"));
        String otp  = body.get("otp");

        User user = userRepository.findById(userId).orElseThrow();

        if (!twoFactorService.verifyOtp(user, otp)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired code"));
        }

        String access  = jwtUtil.generateAccessToken(user.getUsername(), user.getRole());
        String refresh = jwtUtil.generateRefreshToken(user.getUsername());
        return ResponseEntity.ok(Map.of(
            "accessToken", access, "refreshToken", refresh,
            "role", user.getRole(), "userId", user.getId()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (!jwtUtil.isValid(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
        }
        String username = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username).orElseThrow();
        String newAccess = jwtUtil.generateAccessToken(username, user.getRole());
        return ResponseEntity.ok(Map.of("accessToken", newAccess));
    }

    @PostMapping("/request-2fa")
    public ResponseEntity<?> requestEnable2fa(@RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(body.get("userId"));
        User user = userRepository.findById(userId).orElseThrow();
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Add an email first to enable 2FA"));
        }
        twoFactorService.sendOtp(user);
        return ResponseEntity.ok(Map.of("message", "OTP sent to " + user.getEmail()));
    }

    @PostMapping("/confirm-2fa")
    public ResponseEntity<?> confirmEnable2fa(@RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(body.get("userId"));
        String otp  = body.get("otp");
        User user = userRepository.findById(userId).orElseThrow();
        if (!twoFactorService.verifyOtp(user, otp)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired code"));
        }
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "2FA enabled successfully"));
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<?> disable2fa(@RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(body.get("userId"));
        User user = userRepository.findById(userId).orElseThrow();
        user.setTwoFactorEnabled(false);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "2FA disabled"));
    }
}
