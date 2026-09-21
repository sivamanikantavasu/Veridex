package com.scholarsphere.veridex.usageservice.service;

import com.scholarsphere.veridex.common.dto.EngagementAnalyticsDto;
import com.scholarsphere.veridex.common.dto.ReadingHistoryDto;
import com.scholarsphere.veridex.common.dto.ReadingTrackRequest;
import com.scholarsphere.veridex.usageservice.model.ReadingEvent;
import com.scholarsphere.veridex.usageservice.repository.ReadingEventRepository;
import com.scholarsphere.veridex.usageservice.repository.UserCollectionRepository;
import com.scholarsphere.veridex.usageservice.repository.CollectionItemRepository;
import com.scholarsphere.veridex.usageservice.model.UserCollection;
import com.scholarsphere.veridex.usageservice.model.CollectionItem;
import com.scholarsphere.veridex.usageservice.model.AuditEvent;
import com.scholarsphere.veridex.usageservice.repository.AuditEventRepository;
import com.scholarsphere.veridex.common.dto.AuditLogDto;
import com.scholarsphere.veridex.common.dto.CollectionDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsageService {
    private final ReadingEventRepository readingEventRepository;
        private final UserCollectionRepository collectionRepository;
        private final CollectionItemRepository collectionItemRepository;
        private final AuditEventRepository auditEventRepository;

                public UsageService(ReadingEventRepository readingEventRepository, UserCollectionRepository collectionRepository, CollectionItemRepository collectionItemRepository, AuditEventRepository auditEventRepository) {
        this.readingEventRepository = readingEventRepository;
                this.collectionRepository = collectionRepository;
                this.collectionItemRepository = collectionItemRepository;
                this.auditEventRepository = auditEventRepository;
    }

        public List<CollectionDto> getCollections(String userId) {
                return collectionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toCollectionDto).toList();
        }

        public CollectionDto getCollection(String userId, String collectionId) {
                UserCollection collection = collectionRepository.findByIdAndUserId(collectionId, userId)
                                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));
                return toCollectionDto(collection);
        }

        public CollectionDto createCollection(String userId, String name) {
                if (name == null || name.isBlank()) throw new IllegalArgumentException("Collection name is required");
                return toCollectionDto(collectionRepository.save(UserCollection.builder().userId(userId).name(name.trim()).build()));
        }

        public CollectionDto addToCollection(String userId, String collectionId, String contentId) {
                UserCollection collection = collectionRepository.findByIdAndUserId(collectionId, userId)
                                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));
                if (!collectionItemRepository.existsByCollectionIdAndContentId(collection.getId(), contentId)) {
                        collectionItemRepository.save(CollectionItem.builder().collectionId(collection.getId()).contentId(contentId).build());
                }
                return toCollectionDto(collection);
        }

        @Transactional
        public void removeFromCollection(String userId, String collectionId, String contentId) {
                UserCollection collection = collectionRepository.findByIdAndUserId(collectionId, userId)
                                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));
                collectionItemRepository.deleteByCollectionIdAndContentId(collection.getId(), contentId);
        }

        @Transactional
        public void deleteCollection(String userId, String collectionId) {
                UserCollection collection = collectionRepository.findByIdAndUserId(collectionId, userId)
                                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));
                collectionItemRepository.deleteByCollectionId(collection.getId());
                collectionRepository.delete(collection);
        }

        private CollectionDto toCollectionDto(UserCollection collection) {
                List<String> contentIds = collectionItemRepository.findByCollectionId(collection.getId()).stream()
                                .map(CollectionItem::getContentId).toList();
                return CollectionDto.builder().id(collection.getId()).userId(collection.getUserId()).name(collection.getName())
                                .count(contentIds.size()).contentIds(contentIds).createdAt(collection.getCreatedAt().toString()).build();
        }

    public ReadingHistoryDto track(ReadingTrackRequest request) {
        ReadingEvent event = ReadingEvent.builder()
                .userId(request.getUserId())
                .contentId(request.getContentId())
                .contentTitle(request.getContentTitle())
                .chapter(request.getChapter())
                .page(request.getPage())
                .progress(request.getProgress())
                .durationSeconds(request.getDurationSeconds())
                .build();

        ReadingEvent saved = readingEventRepository.save(event);
        return ReadingHistoryDto.builder()
                .id(saved.getId())
                .userId(saved.getUserId())
                .contentId(saved.getContentId())
                .title(saved.getContentTitle())
                .progress(saved.getProgress())
                .lastRead(saved.getCreatedAt().toString())
                .lastChapter(saved.getChapter())
                .lastPage(saved.getPage())
                .build();
    }

    public List<ReadingHistoryDto> getHistoryByUser(String userId) {
        return readingEventRepository.findByUserId(userId).stream()
                .map(event -> ReadingHistoryDto.builder()
                        .id(event.getId())
                        .userId(event.getUserId())
                        .contentId(event.getContentId())
                        .title(event.getContentTitle())
                        .progress(event.getProgress())
                        .lastRead(event.getCreatedAt().toString())
                        .lastChapter(event.getChapter())
                        .lastPage(event.getPage())
                        .build())
                .toList();
    }

    public EngagementAnalyticsDto getAnalytics(String userId) {
        List<ReadingEvent> events = readingEventRepository.findByUserId(userId);
        int totalMinutes = events.stream().mapToInt(e -> e.getDurationSeconds() == null ? 0 : e.getDurationSeconds() / 60).sum();
        double avgProgress = events.stream()
                .mapToInt(e -> e.getProgress() == null ? 0 : e.getProgress())
                .average()
                .orElse(0.0);

        List<EngagementAnalyticsDto.ReadingSessionDto> sessionDtos = events.stream()
                .map(event -> EngagementAnalyticsDto.ReadingSessionDto.builder()
                        .id(event.getId())
                        .userId(event.getUserId())
                        .contentId(event.getContentId())
                        .contentTitle(event.getContentTitle())
                        .durationMinutes((event.getDurationSeconds() == null ? 0 : event.getDurationSeconds()) / 60)
                        .timestamp(event.getCreatedAt().toString())
                        .build())
                .toList();

        return EngagementAnalyticsDto.builder()
                .readingHours((double) Math.max(1, totalMinutes / 60))
                .completionRate(avgProgress)
                .activeUsers(events.size())
                .sessions(sessionDtos)
                .build();
    }

    public EngagementAnalyticsDto getAnalyticsForAllUsers() {
        List<ReadingEvent> events = readingEventRepository.findAll();
        int totalMinutes = events.stream().mapToInt(e -> e.getDurationSeconds() == null ? 0 : e.getDurationSeconds() / 60).sum();
        double avgProgress = events.stream().mapToInt(e -> e.getProgress() == null ? 0 : e.getProgress()).average().orElse(0.0);
        List<EngagementAnalyticsDto.ReadingSessionDto> sessions = events.stream().map(event -> EngagementAnalyticsDto.ReadingSessionDto.builder()
                .id(event.getId()).userId(event.getUserId()).contentId(event.getContentId()).contentTitle(event.getContentTitle())
                .durationMinutes((event.getDurationSeconds() == null ? 0 : event.getDurationSeconds()) / 60).timestamp(event.getCreatedAt().toString()).build()).toList();
        return EngagementAnalyticsDto.builder().readingHours((double) totalMinutes / 60).completionRate(avgProgress)
                .activeUsers((int) events.stream().map(ReadingEvent::getUserId).distinct().count()).sessions(sessions).build();
    }

    public List<AuditLogDto> getAuditLog() {
        return auditEventRepository.findTop200ByOrderByTimestampDesc().stream().map(event -> AuditLogDto.builder()
                .id(event.getId()).timestamp(event.getTimestamp().toString()).eventType(event.getEventType())
                .actor(event.getActor()).target(event.getTarget()).severity(event.getSeverity()).ip(event.getIp()).details(event.getDetails()).build()).toList();
    }
}
