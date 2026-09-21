package com.scholarsphere.veridex.accessservice.repository;

import com.scholarsphere.veridex.accessservice.model.UserPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPlanRepository extends JpaRepository<UserPlan, String> {
    Optional<UserPlan> findByEmailIgnoreCase(String email);
}