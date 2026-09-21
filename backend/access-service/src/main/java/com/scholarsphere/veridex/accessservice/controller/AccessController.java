package com.scholarsphere.veridex.accessservice.controller;

import com.scholarsphere.veridex.accessservice.service.AccessService;
import com.scholarsphere.veridex.common.dto.AccessCheckRequest;
import com.scholarsphere.veridex.common.dto.AccessCheckResponse;
import com.scholarsphere.veridex.common.dto.ApiResponse;
import com.scholarsphere.veridex.common.dto.EntitlementDto;
import com.scholarsphere.veridex.common.dto.SubscriptionStatusDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/access")
public class AccessController {
    private final AccessService accessService;

    public AccessController(AccessService accessService) {
        this.accessService = accessService;
    }

    @PostMapping("/check")
    public ResponseEntity<ApiResponse<AccessCheckResponse>> checkAccess(@RequestBody AccessCheckRequest request,
            @RequestHeader(value = "X-User-Plan", defaultValue = "reader") String plan,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        return ResponseEntity.ok(ApiResponse.ok(accessService.checkAccess(request, plan, userEmail)));
    }

    @GetMapping("/entitlements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<EntitlementDto>>> getEntitlements() {
        return ResponseEntity.ok(ApiResponse.ok(accessService.getEntitlements()));
    }

    @GetMapping("/subscription/{userEmail}")
    public ResponseEntity<ApiResponse<SubscriptionStatusDto>> getSubscriptionStatus(@PathVariable("userEmail") String userEmail,
            @RequestHeader(value = "X-User-Plan", defaultValue = "reader") String plan,
            @RequestHeader(value = "X-User-Email", required = false) String authenticatedEmail) {
        String email = authenticatedEmail == null || authenticatedEmail.isBlank() ? userEmail : authenticatedEmail;
        return ResponseEntity.ok(ApiResponse.ok(accessService.getSubscriptionStatus(email, plan)));
    }
}
