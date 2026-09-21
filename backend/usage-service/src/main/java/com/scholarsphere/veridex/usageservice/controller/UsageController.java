package com.scholarsphere.veridex.usageservice.controller;

import com.scholarsphere.veridex.common.dto.ApiResponse;
import com.scholarsphere.veridex.common.dto.EngagementAnalyticsDto;
import com.scholarsphere.veridex.common.dto.ReadingHistoryDto;
import com.scholarsphere.veridex.common.dto.ReadingTrackRequest;
import com.scholarsphere.veridex.common.dto.CollectionDto;
import com.scholarsphere.veridex.usageservice.service.UsageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usage")
public class UsageController {
    private final UsageService usageService;

    public UsageController(UsageService usageService) {
        this.usageService = usageService;
    }

    @PostMapping("/track")
    public ResponseEntity<ApiResponse<ReadingHistoryDto>> track(@RequestBody ReadingTrackRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Reading tracked", usageService.track(request)));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<List<ReadingHistoryDto>>> history(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.ok(usageService.getHistoryByUser(userId)));
    }

    @GetMapping("/analytics/{userId}")
    public ResponseEntity<ApiResponse<EngagementAnalyticsDto>> analytics(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.ok(usageService.getAnalytics(userId)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<EngagementAnalyticsDto>> allAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(usageService.getAnalyticsForAllUsers()));
    }

    @GetMapping("/audit")
    public ResponseEntity<ApiResponse<List<com.scholarsphere.veridex.common.dto.AuditLogDto>>> audit() {
        return ResponseEntity.ok(ApiResponse.ok(usageService.getAuditLog()));
    }

    @GetMapping("/collections/{userId}")
    public ResponseEntity<ApiResponse<List<CollectionDto>>> collections(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(usageService.getCollections(userId)));
    }

    @PostMapping("/collections/{userId}")
    public ResponseEntity<ApiResponse<CollectionDto>> createCollection(@PathVariable("userId") String userId, @RequestBody CollectionDto request) {
        return ResponseEntity.ok(ApiResponse.ok("Collection created", usageService.createCollection(userId, request.getName())));
    }

    @GetMapping("/collections/{collectionId}/items")
    public ResponseEntity<ApiResponse<CollectionDto>> collection(@PathVariable String collectionId, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.ok(usageService.getCollection(userId, collectionId)));
    }

    @PostMapping("/collections/{collectionId}/items")
    public ResponseEntity<ApiResponse<CollectionDto>> addToCollection(@PathVariable("collectionId") String collectionId, @RequestParam("userId") String userId, @RequestParam("contentId") String contentId) {
        return ResponseEntity.ok(ApiResponse.ok("Content saved", usageService.addToCollection(userId, collectionId, contentId)));
    }

    @DeleteMapping("/collections/{collectionId}/items")
    public ResponseEntity<ApiResponse<Void>> removeFromCollection(@PathVariable String collectionId, @RequestParam String userId, @RequestParam String contentId) {
        usageService.removeFromCollection(userId, collectionId, contentId);
        return ResponseEntity.ok(ApiResponse.ok("Content removed", null));
    }

    @DeleteMapping("/collections/{collectionId}")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(@PathVariable String collectionId, @RequestParam String userId) {
        usageService.deleteCollection(userId, collectionId);
        return ResponseEntity.ok(ApiResponse.ok("Collection deleted", null));
    }
}
