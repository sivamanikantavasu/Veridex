package com.scholarsphere.veridex.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionStatusDto {
    private String plan;
    private String status;              // "active", "none", "expired"
    private String itemsAccessible;
    private String monthlyCharge;
    private String startDate;
    private String endDate;
    private List<EntitlementDto> entitlements;
    private String monthlyPrice;
}
