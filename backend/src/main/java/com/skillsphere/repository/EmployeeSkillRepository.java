package com.skillsphere.repository;

import com.skillsphere.entity.Employee;
import com.skillsphere.entity.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeSkillRepository extends JpaRepository<EmployeeSkill, Long> {

    List<EmployeeSkill> findByEmployeeId(Long employeeId);

    Optional<EmployeeSkill> findByEmployeeIdAndSkillId(Long employeeId, Long skillId);

    void deleteByEmployeeIdAndSkillId(Long employeeId, Long skillId);

    long countByEmployee(Employee employee);
}
