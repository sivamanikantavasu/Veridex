# Veridex backend integration

This project now includes Spring Boot microservices for:
- Eureka discovery
- API Gateway
- Auth service
- Content service
- Access service
- Usage service

MySQL is configured with root password `2389` and database `veridex`.

MySQL Workbench connection:
- Connection method: Standard TCP/IP
- Hostname: `127.0.0.1`
- Port: `3306`
- Username: `root`
- Password: `2389`
- Default schema: `veridex`

Run `backend/database/schema.sql` in Workbench once. To inspect live application data:

```sql
USE veridex;
SELECT id, name, email, plan, role, status FROM users ORDER BY joined_at DESC;
SELECT id, title, type, access_level, status FROM content_items ORDER BY created_at DESC;
SELECT * FROM subscriptions ORDER BY start_date DESC;
SELECT * FROM reading_events ORDER BY created_at DESC;
SELECT * FROM user_collections ORDER BY created_at DESC;
SELECT * FROM collection_items ORDER BY collection_id;
SELECT * FROM audit_events ORDER BY timestamp DESC;
```

The application services use this same MySQL database through `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. H2 is not used by the runtime or tests.

Startup order:
1. Start Eureka: `mvn -pl backend/eureka-server spring-boot:run`
2. Start API Gateway: `mvn -pl backend/api-gateway spring-boot:run`
3. Start other services: `mvn -pl backend/auth-service,backend/content-service,backend/access-service,backend/usage-service spring-boot:run`

Frontend integration remains minimal and uses the existing mock API layer; the backend endpoints are ready to plug into the app when the frontend calls the new gateway host.
