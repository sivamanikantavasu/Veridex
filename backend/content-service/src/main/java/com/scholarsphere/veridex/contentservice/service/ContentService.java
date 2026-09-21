package com.scholarsphere.veridex.contentservice.service;

import com.scholarsphere.veridex.common.dto.ContentDto;
import com.scholarsphere.veridex.common.exception.ResourceNotFoundException;
import com.scholarsphere.veridex.contentservice.model.ContentItem;
import com.scholarsphere.veridex.contentservice.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ContentService {
    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public List<ContentDto> getAll() {
        return contentRepository.findAll().stream().map(this::toDto).toList();
    }

    public ContentDto getById(String id) {
        ContentItem item = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));
        return toDto(item);
    }

    public ContentDto create(ContentDto dto) {
        ContentItem item = new ContentItem();
        apply(dto, item);
        return toDto(contentRepository.save(item));
    }

    public ContentDto update(String id, ContentDto dto) {
        ContentItem item = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));
        apply(dto, item);
        return toDto(contentRepository.save(item));
    }

    public void delete(String id) {
        if (!contentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Content not found");
        }
        contentRepository.deleteById(id);
    }

    public ContentDto attachResource(String id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A non-empty resource file is required");
        }
        ContentItem item = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));
        try {
            item.setResourceName(file.getOriginalFilename());
            item.setResourceContentType(file.getContentType());
            item.setResourceBytes(file.getBytes());
            item.setCoverUrl("/api/content/" + id + "/file");
            return toDto(contentRepository.save(item));
        } catch (java.io.IOException ex) {
            throw new IllegalArgumentException("Resource could not be stored");
        }
    }

    public ResourceFile getResource(String id) {
        ContentItem item = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));
        if (item.getResourceBytes() == null || item.getResourceBytes().length == 0) {
            throw new ResourceNotFoundException("Resource file not found");
        }
        return new ResourceFile(item.getResourceBytes(), item.getResourceContentType(), item.getResourceName());
    }

    public record ResourceFile(byte[] bytes, String contentType, String fileName) {}

    private void apply(ContentDto dto, ContentItem item) {
        item.setTitle(dto.getTitle());
        item.setType(dto.getType());
        item.setAuthor(dto.getAuthor());
        item.setStatus(dto.getStatus());
        item.setAccessLevel(dto.getAccessLevel());
        item.setSubject(dto.getSubject());
        item.setLanguage(dto.getLanguage());
        item.setYear(dto.getYear());
        item.setDescription(dto.getDescription());
        item.setTotalPages(dto.getTotalPages());
        item.setCoverUrl(dto.getCoverUrl());
        item.setCreatedAt(dto.getCreatedAt());
    }

    private ContentDto toDto(ContentItem item) {
        return ContentDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .type(item.getType())
                .author(item.getAuthor())
                .status(item.getStatus())
                .accessLevel(item.getAccessLevel())
                .subject(item.getSubject())
                .language(item.getLanguage())
                .year(item.getYear())
                .description(item.getDescription())
                .totalPages(item.getTotalPages())
                .coverUrl(item.getCoverUrl())
                .createdAt(item.getCreatedAt())
                .resourceName(item.getResourceName())
                .resourceContentType(item.getResourceContentType())
                .build();
    }
}
