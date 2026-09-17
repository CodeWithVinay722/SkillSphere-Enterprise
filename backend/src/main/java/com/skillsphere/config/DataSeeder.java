package com.skillsphere.config;

import com.skillsphere.entity.*;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.repository.EmployeeSkillRepository;
import com.skillsphere.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds a demo admin account, a handful of employees, and a starter skill
 * catalog so the app is fully explorable right after `mvn spring-boot:run`
 * with zero manual setup - handy for grading / demoing this assignment.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final SkillRepository skillRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled || employeeRepository.count() > 0) {
            return;
        }

        log.info("Seeding SkillSphere demo data...");

        List<Skill> skills = skillRepository.saveAll(List.of(
                Skill.builder().name("Java").category("Programming").build(),
                Skill.builder().name("Spring Boot").category("Programming").build(),
                Skill.builder().name("React").category("Programming").build(),
                Skill.builder().name("SQL").category("Database").build(),
                Skill.builder().name("AWS").category("Cloud").build(),
                Skill.builder().name("Docker").category("DevOps").build(),
                Skill.builder().name("Python").category("Programming").build(),
                Skill.builder().name("Project Management").category("Soft Skill").build(),
                Skill.builder().name("Communication").category("Soft Skill").build(),
                Skill.builder().name("UI/UX Design").category("Design").build()
        ));

        Employee admin = Employee.builder()
                .employeeId("EMP001")
                .name("Ava Sharma")
                .email("admin@skillsphere.com")
                .password(passwordEncoder.encode("Admin@123"))
                .department("Management")
                .designation("HR Administrator")
                .phone("+1 555 0100")
                .bio("Manages the employee directory and org-wide skill initiatives.")
                .role(Role.ADMIN)
                .avatarColor("#2563eb")
                .joinDate(LocalDate.of(2021, 3, 1))
                .build();

        Employee dev1 = Employee.builder()
                .employeeId("EMP002")
                .name("Rahul Verma")
                .email("rahul.verma@skillsphere.com")
                .password(passwordEncoder.encode("Employee@123"))
                .department("Engineering")
                .designation("Senior Software Engineer")
                .phone("+1 555 0101")
                .bio("Backend engineer focused on distributed systems and cloud infrastructure.")
                .role(Role.EMPLOYEE)
                .avatarColor("#16834b")
                .joinDate(LocalDate.of(2022, 6, 15))
                .build();

        Employee dev2 = Employee.builder()
                .employeeId("EMP003")
                .name("Priya Nair")
                .email("priya.nair@skillsphere.com")
                .password(passwordEncoder.encode("Employee@123"))
                .department("IT")
                .designation("Frontend Developer")
                .phone("+1 555 0102")
                .bio("Builds delightful, accessible user interfaces.")
                .role(Role.EMPLOYEE)
                .avatarColor("#c2410c")
                .joinDate(LocalDate.of(2023, 1, 10))
                .build();

        employeeRepository.saveAll(List.of(admin, dev1, dev2));

        employeeSkillRepository.saveAll(List.of(
                EmployeeSkill.builder().employee(dev1).skill(skills.get(0)).rating(5).yearsOfExperience(6).build(),
                EmployeeSkill.builder().employee(dev1).skill(skills.get(1)).rating(4).yearsOfExperience(4).build(),
                EmployeeSkill.builder().employee(dev1).skill(skills.get(4)).rating(3).yearsOfExperience(2).build(),
                EmployeeSkill.builder().employee(dev2).skill(skills.get(2)).rating(5).yearsOfExperience(3).build(),
                EmployeeSkill.builder().employee(dev2).skill(skills.get(9)).rating(4).yearsOfExperience(3).build(),
                EmployeeSkill.builder().employee(dev2).skill(skills.get(8)).rating(4).yearsOfExperience(3).build()
        ));

        log.info("Seed complete. Demo logins:");
        log.info("  Admin    -> admin@skillsphere.com / Admin@123");
        log.info("  Employee -> rahul.verma@skillsphere.com / Employee@123");
        log.info("  Employee -> priya.nair@skillsphere.com / Employee@123");
    }
}
