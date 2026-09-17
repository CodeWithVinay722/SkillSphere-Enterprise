package com.skillsphere.controller;

import com.skillsphere.dto.ChangePasswordRequest;
import com.skillsphere.dto.EmployeeResponse;
import com.skillsphere.dto.EmployeeSkillResponse;
import com.skillsphere.dto.UpdateProfileRequest;
import com.skillsphere.entity.Employee;
import com.skillsphere.service.EmployeeService;
import com.skillsphere.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final SkillService skillService;

    // ---------- Directory (any authenticated user can view) ----------

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        List<EmployeeResponse> employees = employeeService.getAllEmployees().stream()
                .map(EmployeeResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse response = EmployeeResponse.fromEntity(employeeService.getEmployeeById(id));
        List<EmployeeSkillResponse> skills = skillService.getSkillsForEmployee(id).stream()
                .map(EmployeeSkillResponse::fromEntity)
                .collect(Collectors.toList());
        response.setSkills(skills);
        return ResponseEntity.ok(response);
    }

    // ---------- Current user's own profile ----------

    @GetMapping("/me")
    public ResponseEntity<EmployeeResponse> getMyProfile(@AuthenticationPrincipal Employee me) {
        return getEmployeeById(me.getId());
    }

    @PutMapping("/me")
    public ResponseEntity<EmployeeResponse> updateMyProfile(@AuthenticationPrincipal Employee me,
                                                              @Valid @RequestBody UpdateProfileRequest request) {
        Employee updated = employeeService.updateOwnProfile(me.getId(), request);
        return ResponseEntity.ok(EmployeeResponse.fromEntity(updated));
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@AuthenticationPrincipal Employee me,
                                                                @Valid @RequestBody ChangePasswordRequest request) {
        employeeService.changePassword(me.getId(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // ---------- Admin-only management ----------

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody Employee employee) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(EmployeeResponse.fromEntity(employeeService.createEmployee(employee)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> updateEmployee(@PathVariable Long id,
                                                            @Valid @RequestBody Employee employee) {
        return ResponseEntity.ok(EmployeeResponse.fromEntity(employeeService.updateEmployee(id, employee)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
