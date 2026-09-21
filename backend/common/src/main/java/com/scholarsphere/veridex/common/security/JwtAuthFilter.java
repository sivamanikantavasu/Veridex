package com.scholarsphere.veridex.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(SecurityConstants.TOKEN_HEADER);

        // Also check if Gateway forwarded user context headers
        String gatewayUserId = request.getHeader("X-User-Id");
        String gatewayUserEmail = request.getHeader("X-User-Email");
        String gatewayUserRole = request.getHeader("X-User-Role");

        if (StringUtils.hasText(gatewayUserEmail) && StringUtils.hasText(gatewayUserRole)) {
            List<SimpleGrantedAuthority> authorities = buildAuthorities(gatewayUserRole);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(gatewayUserEmail, null, authorities);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else if (StringUtils.hasText(authHeader) && authHeader.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            String token = authHeader.substring(SecurityConstants.TOKEN_PREFIX.length());
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);
                List<SimpleGrantedAuthority> authorities = buildAuthorities(role);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private List<SimpleGrantedAuthority> buildAuthorities(String role) {
        String normalizedRole = (role == null || role.isBlank()) ? "ROLE_USER" : role.trim();
        if (normalizedRole.startsWith("ROLE_")) {
            normalizedRole = normalizedRole.toUpperCase();
        } else {
            normalizedRole = "ROLE_" + normalizedRole.toUpperCase();
        }

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(normalizedRole));

        String shortRole = normalizedRole.replaceFirst("^ROLE_", "");
        if (!shortRole.isBlank()) {
            authorities.add(new SimpleGrantedAuthority(shortRole));
        }

        return authorities;
    }
}
