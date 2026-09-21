package com.scholarsphere.veridex.authservice.controller;

import com.scholarsphere.veridex.authservice.service.AuthService;
import com.scholarsphere.veridex.common.dto.ApiResponse;
import com.scholarsphere.veridex.common.dto.AdminUserRequest;
import com.scholarsphere.veridex.common.dto.AuthResponse;
import com.scholarsphere.veridex.common.dto.LoginRequest;
import com.scholarsphere.veridex.common.dto.RegisterRequest;
import com.scholarsphere.veridex.common.dto.UserDto;
import com.scholarsphere.veridex.common.dto.ChangePasswordRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User registered successfully", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(request)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(Authentication authentication) {
        authService.logout(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Logout recorded", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> me(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.ok(authService.getUserByEmail(email)));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(Authentication authentication, @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password updated", null));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<java.util.List<UserDto>>> users() {
        return ResponseEntity.ok(ApiResponse.ok(authService.getAllUsers()));
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody AdminUserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User created", authService.createUser(request)));
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.ok(authService.getUserById(id)));
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable("id") String id, @RequestBody AdminUserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User updated", authService.updateUser(id, request)));
    }

    @PatchMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(@PathVariable("id") String id, @RequestParam("value") String value) {
        return ResponseEntity.ok(ApiResponse.ok("User status updated", authService.updateStatus(id, value)));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable("id") String id) {
        authService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validate() {
        return ResponseEntity.ok(ApiResponse.ok(true));
    }

    @PatchMapping("/me/plan")
    public ResponseEntity<ApiResponse<AuthResponse>> updateMyPlan(Authentication authentication, @RequestParam("plan") String plan) {
        return ResponseEntity.ok(ApiResponse.ok("Plan updated", authService.updatePlanByEmail(authentication.getName(), plan)));
    }
}
