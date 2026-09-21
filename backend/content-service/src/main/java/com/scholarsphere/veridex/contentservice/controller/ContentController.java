package com.scholarsphere.veridex.contentservice.controller;

import com.scholarsphere.veridex.common.dto.ApiResponse;
import com.scholarsphere.veridex.common.dto.ContentDto;
import com.scholarsphere.veridex.contentservice.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {
    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContentDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(contentService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContentDto>> getById(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.ok(contentService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContentDto>> create(@RequestBody ContentDto contentDto) {
        return ResponseEntity.ok(ApiResponse.ok("Content created", contentService.create(contentDto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContentDto>> update(@PathVariable("id") String id, @RequestBody ContentDto contentDto) {
        return ResponseEntity.ok(ApiResponse.ok("Content updated", contentService.update(id, contentDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id) {
        contentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Content deleted", null));
    }

    @PostMapping("/{id}/file")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContentDto>> uploadFile(@PathVariable("id") String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok("Resource uploaded", contentService.attachResource(id, file)));
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<ByteArrayResource> getFile(@PathVariable("id") String id) {
        ContentService.ResourceFile resource = contentService.getResource(id);
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try { if (resource.contentType() != null) mediaType = MediaType.parseMediaType(resource.contentType()); } catch (IllegalArgumentException ignored) { }
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.fileName() + "\"")
                .body(new ByteArrayResource(resource.bytes()));
    }
}
