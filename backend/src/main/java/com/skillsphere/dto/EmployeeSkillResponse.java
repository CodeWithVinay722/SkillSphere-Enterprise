package com.skillsphere.dto;

import com.skillsphere.entity.EmployeeSkill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSkillResponse {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private int rating;
    private int yearsOfExperience;

    public static EmployeeSkillResponse fromEntity(EmployeeSkill es) {
        return EmployeeSkillResponse.builder()
                .id(es.getId())
                .skillId(es.getSkill().getId())
                .skillName(es.getSkill().getName())
                .category(es.getSkill().getCategory())
                .rating(es.getRating())
                .yearsOfExperience(es.getYearsOfExperience())
                .build();
    }
}
