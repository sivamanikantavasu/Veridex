package com.scholarsphere.veridex.authservice.service;

import com.scholarsphere.veridex.authservice.repository.UserRepository;
import com.scholarsphere.veridex.common.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class AuthServiceLoginSeedTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Test
    void shouldSeedTheDefaultCredentialsForLogin() {
        assertTrue(userRepository.existsByEmailIgnoreCase("DSMVasu@gmail.com"));
        assertTrue(userRepository.existsByEmailIgnoreCase("VIjay@gmail.com"));
        assertTrue(userRepository.existsByEmailIgnoreCase("Sai@gmail.com"));
        assertTrue(userRepository.existsByEmailIgnoreCase("Jagu@gmail.com"));
        assertTrue(userRepository.existsByEmailIgnoreCase("Raju@gmail.com"));
    }

    @Test
    void shouldAuthenticateTheSeededAdminAndUserAccounts() {
        var adminResponse = authService.login(LoginRequest.builder().email("DSMVasu@gmail.com").password("Vasu@2389").build());
        assertTrue(adminResponse.isSuccess());
        assertEquals("ROLE_ADMIN", adminResponse.getUser().getRole());

        var secondAdminResponse = authService.login(LoginRequest.builder().email("VIjay@gmail.com").password("Vijay@31").build());
        assertTrue(secondAdminResponse.isSuccess());
        assertEquals("ROLE_ADMIN", secondAdminResponse.getUser().getRole());

        var userResponse = authService.login(LoginRequest.builder().email("Sai@gmail.com").password("Sai@143").build());
        assertTrue(userResponse.isSuccess());
        assertEquals("ROLE_USER", userResponse.getUser().getRole());
    }

    @Test
    void shouldListUsersFromTheDatabase() {
        var users = authService.getAllUsers();
        assertTrue(users.size() >= 5);
        assertTrue(users.stream().anyMatch(user -> "DSMVasu@gmail.com".equalsIgnoreCase(user.getEmail())));
    }
}
