package com.scholarsphere.veridex.authservice.config;

import com.scholarsphere.veridex.authservice.model.User;
import com.scholarsphere.veridex.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Configuration
public class DefaultUserSeeder {

    @Bean
    public CommandLineRunner seedDefaultUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            List<User> defaultUsers = List.of(
                User.builder()
                    .name("DSMVasu")
                    .email("DSMVasu@gmail.com")
                    .password(passwordEncoder.encode("Vasu@2389"))
                    .role("ADMIN")
                    .status("active")
                    .joinedAt(Instant.now())
                    .build(),
                User.builder()
                    .name("VIjay")
                    .email("VIjay@gmail.com")
                    .password(passwordEncoder.encode("Vijay@31"))
                    .role("ADMIN")
                    .status("active")
                    .joinedAt(Instant.now())
                    .build(),
                User.builder()
                    .name("Sai")
                    .email("Sai@gmail.com")
                    .password(passwordEncoder.encode("Sai@143"))
                    .role("USER")
                    .status("active")
                    .joinedAt(Instant.now())
                    .build(),
                User.builder()
                    .name("Jagu")
                    .email("Jagu@gmail.com")
                    .password(passwordEncoder.encode("Jagu@143"))
                    .role("USER")
                    .status("active")
                    .joinedAt(Instant.now())
                    .build(),
                User.builder()
                    .name("Raju")
                    .email("Raju@gmail.com")
                    .password(passwordEncoder.encode("Rani@143"))
                    .role("USER")
                    .status("active")
                    .joinedAt(Instant.now())
                    .build()
            );

            for (User defaultUser : defaultUsers) {
                String normalizedEmail = defaultUser.getEmail().trim().toLowerCase(Locale.ROOT);
                if (!userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                    User userToSave = User.builder()
                            .name(defaultUser.getName())
                            .email(normalizedEmail)
                            .password(defaultUser.getPassword())
                            .role(defaultUser.getRole())
                            .status(defaultUser.getStatus())
                            .joinedAt(defaultUser.getJoinedAt())
                            .build();
                    userRepository.save(userToSave);
                }
            }
        };
    }
}
