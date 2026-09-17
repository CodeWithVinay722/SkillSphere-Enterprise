package com.skillsphere.controller;

import com.skillsphere.dto.AddSkillRequest;
import com.skillsphere.dto.EmployeeSkillResponse;
import com.skillsphere.entity.Employee;
import com.skillsphere.entity.Skill;
import com.skillsphere.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    /** Global skill catalog, used to populate the "add skill" dropdown/autocomplete. */
    @GetMapping("/api/skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    /** Skills belonging to the logged-in employee, each with a self-rating (1-5). */
    @GetMapping("/api/employees/me/skills")
    public ResponseEntity<List<EmployeeSkillResponse>> getMySkills(@AuthenticationPrincipal Employee me) {
        List<EmployeeSkillResponse> skills = skillService.getSkillsForEmployee(me.getId()).stream()
                .map(EmployeeSkillResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(skills);
    }

    @PostMapping("/api/employees/me/skills")
    public ResponseEntity<EmployeeSkillResponse> addOrUpdateMySkill(@AuthenticationPrincipal Employee me,
                                                                     @Valid @RequestBody AddSkillRequest request) {
        var saved = skillService.addOrUpdateSkill(me.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(EmployeeSkillResponse.fromEntity(saved));
    }

    @DeleteMapping("/api/employees/me/skills/{skillId}")
    public ResponseEntity<Void> removeMySkill(@AuthenticationPrincipal Employee me, @PathVariable Long skillId) {
        skillService.removeSkill(me.getId(), skillId);
        return ResponseEntity.noContent().build();
    }
}
