package com.skillsphere.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddSkillRequest {

    /** Either an existing skill id, or a new skill name (skillName) to create on the fly. */
    private Long skillId;

    private String skillName;

    private String category = "General";

    @Min(1)
    @Max(5)
    private int rating = 1;

    private int yearsOfExperience = 0;
}
