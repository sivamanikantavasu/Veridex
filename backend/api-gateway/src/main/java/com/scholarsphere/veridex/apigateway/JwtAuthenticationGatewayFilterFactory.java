package com.scholarsphere.veridex.apigateway;

import com.scholarsphere.veridex.common.security.JwtUtil;
import com.scholarsphere.veridex.common.security.SecurityConstants;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JwtAuthenticationGatewayFilterFactory extends AbstractGatewayFilterFactory<Object> {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationGatewayFilterFactory(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String authHeader = request.getHeaders().getFirst(SecurityConstants.TOKEN_HEADER);

            if (authHeader == null || !authHeader.startsWith(SecurityConstants.TOKEN_PREFIX)) {
                return chain.filter(exchange);
            }

            String token = authHeader.substring(SecurityConstants.TOKEN_PREFIX.length());
            if (!jwtUtil.validateToken(token)) {
                return chain.filter(exchange);
            }

            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);
            String plan = jwtUtil.extractPlan(token);
            String userId = jwtUtil.extractUserId(token);

            request = request.mutate()
                    .header("X-User-Email", email)
                    .header("X-User-Role", role)
                    .header("X-User-Plan", plan == null ? "reader" : plan)
                    .header("X-User-Id", userId)
                    .build();

            return chain.filter(exchange.mutate().request(request).build());
        };
    }

    @Override
    public List<String> shortcutFieldOrder() {
        return List.of();
    }
}
