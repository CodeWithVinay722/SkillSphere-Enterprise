package com.skillsphere.service;

import com.skillsphere.dto.AddSkillRequest;
import com.skillsphere.entity.Employee;
import com.skillsphere.entity.EmployeeSkill;
import com.skillsphere.entity.Skill;
import com.skillsphere.exception.EmployeeNotFoundException;
import com.skillsphere.exception.SkillNotFoundException;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.repository.EmployeeSkillRepository;
import com.skillsphere.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final EmployeeRepository employeeRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Transactional
    public Skill createSkill(String name, String category) {
        return skillRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> skillRepository.save(
                        Skill.builder().name(name).category(category == null || category.isBlank() ? "General" : category).build()));
    }

    public List<EmployeeSkill> getSkillsForEmployee(Long employeeId) {
        return employeeSkillRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public EmployeeSkill addOrUpdateSkill(Long employeeId, AddSkillRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));

        Skill skill;
        if (request.getSkillId() != null) {
            skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new SkillNotFoundException("Skill not found"));
        } else if (request.getSkillName() != null && !request.getSkillName().isBlank()) {
            skill = createSkill(request.getSkillName(), request.getCategory());
        } else {
            throw new SkillNotFoundException("Provide either skillId or skillName");
        }

        EmployeeSkill employeeSkill = employeeSkillRepository
                .findByEmployeeIdAndSkillId(employeeId, skill.getId())
                .orElse(EmployeeSkill.builder().employee(employee).skill(skill).build());

        employeeSkill.setRating(request.getRating());
        employeeSkill.setYearsOfExperience(request.getYearsOfExperience());

        return employeeSkillRepository.save(employeeSkill);
    }

    @Transactional
    public void removeSkill(Long employeeId, Long skillId) {
        employeeSkillRepository.deleteByEmployeeIdAndSkillId(employeeId, skillId);
    }
}
