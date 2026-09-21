package com.scholarsphere.veridex.usageservice.repository;

import com.scholarsphere.veridex.usageservice.model.CollectionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CollectionItemRepository extends JpaRepository<CollectionItem, String> {
    List<CollectionItem> findByCollectionId(String collectionId);
    boolean existsByCollectionIdAndContentId(String collectionId, String contentId);
    void deleteByCollectionIdAndContentId(String collectionId, String contentId);
    void deleteByCollectionId(String collectionId);
}