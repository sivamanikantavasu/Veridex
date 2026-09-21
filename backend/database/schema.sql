CREATE DATABASE IF NOT EXISTS veridex
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE veridex;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    plan VARCHAR(32) NOT NULL DEFAULT 'reader',
    role VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
);

CREATE TABLE IF NOT EXISTS content_items (
    id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    author VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL,
    access_level VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    language VARCHAR(100),
    publication_year VARCHAR(20),
    description TEXT,
    total_pages INT,
    cover_url VARCHAR(1000),
    created_at VARCHAR(100),
    resource_name VARCHAR(255),
    resource_content_type VARCHAR(255),
    resource_bytes LONGBLOB,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    plan VARCHAR(32) NOT NULL DEFAULT 'reader',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (id),
    UNIQUE KEY uk_subscriptions_user (user_id),
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS reading_events (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    content_id VARCHAR(36) NOT NULL,
    content_title VARCHAR(255) NOT NULL,
    chapter INT,
    page INT,
    progress INT,
    duration_seconds INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_collections (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection_items (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    collection_id VARCHAR(36) NOT NULL,
    content_id VARCHAR(36) NOT NULL,
    UNIQUE KEY uk_collection_content (collection_id, content_id)
);

CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(64) NOT NULL,
    actor VARCHAR(255) NOT NULL,
    target VARCHAR(255),
    severity VARCHAR(32) NOT NULL,
    ip VARCHAR(64),
    details TEXT
);