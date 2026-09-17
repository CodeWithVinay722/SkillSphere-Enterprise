package com.skillsphere.dto;

import com.skillsphere.entity.Employee;
import com.skillsphere.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/** Safe outward-facing representation of an Employee (no password). */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String employeeId;
    private String name;
    private String email;
    private String department;
    private String designation;
    private String phone;
    private String bio;
    private Role role;
    private LocalDate joinDate;
    private String avatarColor;
    private List<EmployeeSkillResponse> skills;

    public static EmployeeResponse fromEntity(Employee e) {
        return EmployeeResponse.builder()
                .id(e.getId())
                .employeeId(e.getEmployeeId())
                .name(e.getName())
                .email(e.getEmail())
                .department(e.getDepartment())
                .designation(e.getDesignation())
                .phone(e.getPhone())
                .bio(e.getBio())
                .role(e.getRole())
                .joinDate(e.getJoinDate())
                .avatarColor(e.getAvatarColor())
                .build();
    }
}
