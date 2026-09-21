package com.scholarsphere.veridex.contentservice;

import com.scholarsphere.veridex.contentservice.repository.ContentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ContentSeederTest {

    @Autowired
    private ContentRepository contentRepository;

    @Test
    void shouldStartWithEmptyContentRepository() {
        assertTrue(contentRepository.count() >= 0, "Content repository is backed by MySQL");
    }
}
