package com.scholarsphere.veridex.authservice.service;

import com.scholarsphere.veridex.authservice.model.User;
import com.scholarsphere.veridex.authservice.repository.UserRepository;
import com.scholarsphere.veridex.authservice.repository.AuditEventRepository;
import com.scholarsphere.veridex.authservice.model.AuditEvent;
import com.scholarsphere.veridex.common.dto.AuthResponse;
import com.scholarsphere.veridex.common.dto.AdminUserRequest;
import com.scholarsphere.veridex.common.dto.LoginRequest;
import com.scholarsphere.veridex.common.dto.RegisterRequest;
import com.scholarsphere.veridex.common.dto.UserDto;
import com.scholarsphere.veridex.common.dto.ChangePasswordRequest;
import com.scholarsphere.veridex.common.security.JwtUtil;
import com.scholarsphere.veridex.common.security.SecurityConstants;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuditEventRepository auditEventRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuditEventRepository auditEventRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.auditEventRepository = auditEventRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("User already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() == null || request.getRole().isBlank() ? "user" : request.getRole().toLowerCase(Locale.ROOT))
                .status("active")
                .joinedAt(Instant.now())
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getId(), saved.getName(), saved.getEmail(), toRole(saved.getRole()), saved.getPlan());
        return AuthResponse.builder()
                .success(true)
                .token(token)
                .tokenType(SecurityConstants.TOKEN_PREFIX.trim())
                .expiresIn(SecurityConstants.JWT_EXPIRATION_MS / 1000)
                .user(toDto(saved))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        auditEventRepository.save(AuditEvent.builder().timestamp(Instant.now()).eventType("login")
            .actor(user.getEmail()).target("auth").severity("success").details("Successful sign in").build());

        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getEmail(), toRole(user.getRole()), user.getPlan());
        return AuthResponse.builder()
                .success(true)
                .token(token)
                .tokenType(SecurityConstants.TOKEN_PREFIX.trim())
                .expiresIn(SecurityConstants.JWT_EXPIRATION_MS / 1000)
                .user(toDto(user))
                .build();
    }

    public UserDto getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email)).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void logout(String email) {
        auditEventRepository.save(AuditEvent.builder().timestamp(Instant.now()).eventType("logout")
                .actor(normalizeEmail(email)).target("auth").severity("info").details("User signed out").build());
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    public UserDto getUserById(String id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserDto createUser(AdminUserRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (email.isBlank() || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Name, email, and password are required");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("User already exists");
        }
        User user = User.builder()
                .name(required(request.getName(), "Name is required"))
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(normalizeRole(request.getRole()))
                .status(normalizeStatus(request.getStatus()))
                .plan(normalizePlan(request.getPlan()))
                .joinedAt(Instant.now())
                .build();
        return toDto(userRepository.save(user));
    }

    public UserDto updateUser(String id, AdminUserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        String email = normalizeEmail(request.getEmail());
        if (email.isBlank() || request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name and email are required");
        }
        userRepository.findByEmailIgnoreCase(email).filter(existing -> !existing.getId().equals(id)).ifPresent(existing -> {
            throw new IllegalArgumentException("Email is already in use");
        });
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setRole(normalizeRole(request.getRole()));
        user.setStatus(normalizeStatus(request.getStatus()));
        user.setPlan(normalizePlan(request.getPlan()));
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return toDto(userRepository.save(user));
    }

    public UserDto updateStatus(String id, String status) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(normalizeStatus(status));
        return toDto(userRepository.save(user));
    }

    public AuthResponse updatePlanByEmail(String email, String plan) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPlan(normalizePlan(plan));
        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getId(), saved.getName(), saved.getEmail(), toRole(saved.getRole()), saved.getPlan());
        return AuthResponse.builder().success(true).token(token).tokenType(SecurityConstants.TOKEN_PREFIX.trim())
            .expiresIn(SecurityConstants.JWT_EXPIRATION_MS / 1000).user(toDto(saved)).build();
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if ("dsmvasu@gmail.com".equalsIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("The main admin account cannot be deleted");
        }
        userRepository.delete(user);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(toRole(user.getRole()))
                .status(user.getStatus())
                .joinedAt(user.getJoinedAt().toString())
                .plan(user.getPlan())
                .build();
    }

    private String toRole(String role) {
        if (role == null || role.isBlank()) return SecurityConstants.ROLE_USER;
        String normalized = role.trim().toUpperCase(Locale.ROOT);
        if (normalized.startsWith("ROLE_")) return normalized;
        if ("ADMIN".equals(normalized)) return SecurityConstants.ROLE_ADMIN;
        return SecurityConstants.ROLE_USER;
    }

    private String normalizeRole(String role) {
        return "admin".equalsIgnoreCase(role) || "role_admin".equalsIgnoreCase(role) ? "ADMIN" : "USER";
    }

    private String normalizeStatus(String status) {
        if ("suspended".equalsIgnoreCase(status)) return "suspended";
        if ("pending".equalsIgnoreCase(status)) return "pending";
        return "active";
    }

    private String normalizePlan(String plan) {
        if ("scholar".equalsIgnoreCase(plan)) return "scholar";
        if ("institution".equalsIgnoreCase(plan)) return "institution";
        return "reader";
    }

    private String required(String value, String message) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(message);
        return value.trim();
    }
}
