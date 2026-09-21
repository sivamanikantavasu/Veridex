package com.scholarsphere.veridex.accessservice.service;

import com.scholarsphere.veridex.common.dto.AccessCheckRequest;
import com.scholarsphere.veridex.common.dto.AccessCheckResponse;
import com.scholarsphere.veridex.common.dto.ContentDto;
import com.scholarsphere.veridex.common.dto.EntitlementDto;
import com.scholarsphere.veridex.common.dto.SubscriptionStatusDto;
import com.scholarsphere.veridex.accessservice.repository.UserPlanRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Locale;

@Service
public class AccessService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final UserPlanRepository userPlanRepository;

    public AccessService(UserPlanRepository userPlanRepository) {
        this.userPlanRepository = userPlanRepository;
    }

    @Value("${content.service.base-url:http://localhost:9002}")
    private String contentServiceBaseUrl;

    public AccessCheckResponse checkAccess(AccessCheckRequest request) {
        return checkAccess(request, "reader");
    }

    public AccessCheckResponse checkAccess(AccessCheckRequest request, String plan) {
        return checkAccess(request, plan, null);
    }

    public AccessCheckResponse checkAccess(AccessCheckRequest request, String plan, String userEmail) {
        String effectivePlan = resolvePlan(userEmail, plan);
        ResponseEntity<com.scholarsphere.veridex.common.dto.ApiResponse> response = restTemplate.getForEntity(contentServiceBaseUrl + "/api/content/" + request.getContentId(), com.scholarsphere.veridex.common.dto.ApiResponse.class);
        ContentDto content = response.getBody() == null ? null : (ContentDto) new org.springframework.core.convert.converter.Converter<Object, ContentDto>() {
            public ContentDto convert(Object source) {
                return new com.fasterxml.jackson.databind.ObjectMapper().convertValue(source, ContentDto.class);
            }
        }.convert(response.getBody().getData());
        if (content == null) {
            return AccessCheckResponse.builder().hasAccess(false).reason("Content not found").build();
        }

        boolean hasAccess = "open".equalsIgnoreCase(content.getAccessLevel())
            || "institution".equalsIgnoreCase(effectivePlan)
                || "scholar".equalsIgnoreCase(effectivePlan)
            || ("reader".equalsIgnoreCase(effectivePlan) && "journal".equalsIgnoreCase(content.getType()));
        return AccessCheckResponse.builder()
                .hasAccess(hasAccess)
                .reason(hasAccess ? null : "Access denied")
                .readOnly(false)
                .noDownload(false)
                .concurrentLimit(2)
                .deviceLimit(3)
                .watermarkText("ScholarSphere Digital")
                .build();
    }

    public List<EntitlementDto> getEntitlements() {
        return List.of(
                EntitlementDto.builder().id("ent1").plan("reader").contentType("all").subject("all").deviceLimit(3).concurrentLimit(2).readOnly(false).noDownload(false).build(),
                EntitlementDto.builder().id("ent2").plan("scholar").contentType("journal").subject("all").deviceLimit(5).concurrentLimit(3).readOnly(false).noDownload(true).build()
        );
    }

    public SubscriptionStatusDto getSubscriptionStatus(String userEmail, String plan) {
        String normalized = resolvePlan(userEmail, plan);
        String price = "scholar".equals(normalized) ? "₹34/mo" : "reader".equals(normalized) ? "₹14/mo" : "Custom";
        return SubscriptionStatusDto.builder()
                .plan(normalized.substring(0, 1).toUpperCase() + normalized.substring(1))
                .status("active")
                .itemsAccessible("reader".equals(normalized) ? "200/month" : "Unlimited")
                .monthlyCharge(price)
                .monthlyPrice(price)
                .startDate("2026-09-01")
                .endDate("2027-09-01")
                .entitlements(getEntitlements())
                .build();
    }

    private String resolvePlan(String userEmail, String fallbackPlan) {
        if (userEmail == null || userEmail.isBlank()) {
            return normalizePlan(fallbackPlan);
        }
        return userPlanRepository.findByEmailIgnoreCase(userEmail.trim())
                .map(user -> normalizePlan(user.getPlan()))
                .orElseGet(() -> normalizePlan(fallbackPlan));
    }

    private String normalizePlan(String plan) {
        String normalized = plan == null ? "" : plan.trim().toLowerCase(Locale.ROOT);
        if ("scholar".equals(normalized) || "institution".equals(normalized)) return normalized;
        return "reader";
    }

    public SubscriptionStatusDto getSubscriptionStatus(String userEmail) {
        return getSubscriptionStatus(userEmail, "reader");
    }
}
