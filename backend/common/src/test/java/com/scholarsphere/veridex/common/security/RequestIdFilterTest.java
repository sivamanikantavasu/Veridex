package com.scholarsphere.veridex.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

class RequestIdFilterTest {

    private RequestIdFilter filter;

    @BeforeEach
    void setUp() {
        filter = new RequestIdFilter();
    }

    @Test
    void shouldGenerateRequestIdWhenHeaderMissing() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = Mockito.mock(FilterChain.class);

        filter.doFilterInternal(request, response, filterChain);

        String headerValue = response.getHeader(SecurityConstants.REQUEST_ID_HEADER);
        assertNotNull(headerValue);
        assertFalse(headerValue.isBlank());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldPreserveExistingRequestIdWhenProvided() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String existingId = "req-custom-12345";
        request.addHeader(SecurityConstants.REQUEST_ID_HEADER, existingId);
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = Mockito.mock(FilterChain.class);

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(existingId, response.getHeader(SecurityConstants.REQUEST_ID_HEADER));
        verify(filterChain).doFilter(request, response);
    }
}
