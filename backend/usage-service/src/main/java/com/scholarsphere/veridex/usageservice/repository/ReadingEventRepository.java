package com.scholarsphere.veridex.usageservice.repository;

import com.scholarsphere.veridex.usageservice.model.ReadingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingEventRepository extends JpaRepository<ReadingEvent, String> {
    List<ReadingEvent> findByUserId(String userId);
    List<ReadingEvent> findByContentId(String contentId);
}
