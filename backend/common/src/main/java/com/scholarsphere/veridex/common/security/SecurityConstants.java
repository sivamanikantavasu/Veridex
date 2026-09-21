package com.scholarsphere.veridex.common.security;

public final class SecurityConstants {
    private SecurityConstants() {}

    public static final String JWT_SECRET = "scholarSphereDigitalVeridexSuperSecretSecureKeyForJwtSigning2026";
    public static final long JWT_EXPIRATION_MS = 86400000L; // 24 hours
    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String REQUEST_ID_HEADER = "X-Request-Id";

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";
}
