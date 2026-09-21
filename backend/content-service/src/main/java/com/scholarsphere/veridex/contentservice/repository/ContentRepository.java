package com.scholarsphere.veridex.contentservice.repository;

import com.scholarsphere.veridex.contentservice.model.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<ContentItem, String> {
}
