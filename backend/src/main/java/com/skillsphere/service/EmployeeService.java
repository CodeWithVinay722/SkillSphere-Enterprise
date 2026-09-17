package com.skillsphere.service;

import com.skillsphere.dto.ChangePasswordRequest;
import com.skillsphere.dto.UpdateProfileRequest;
import com.skillsphere.entity.Employee;
import com.skillsphere.exception.EmployeeNotFoundException;
import com.skillsphere.exception.InvalidCredentialsException;
import com.skillsphere.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
    }

    @Transactional
    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (employee.getPassword() == null || employee.getPassword().isBlank()) {
            employee.setPassword(passwordEncoder.encode("Welcome@123"));
        } else {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, Employee updated) {
        Employee existing = getEmployeeById(id);
        existing.setEmployeeId(updated.getEmployeeId());
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setDepartment(updated.getDepartment());
        existing.setDesignation(updated.getDesignation());
        if (updated.getRole() != null) {
            existing.setRole(updated.getRole());
        }
        return employeeRepository.save(existing);
    }

    @Transactional
    public Employee updateOwnProfile(Long id, UpdateProfileRequest request) {
        Employee existing = getEmployeeById(id);
        existing.setName(request.getName());
        existing.setPhone(request.getPhone());
        existing.setBio(request.getBio());
        existing.setDesignation(request.getDesignation());
        return employeeRepository.save(existing);
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        Employee existing = getEmployeeById(id);
        if (!passwordEncoder.matches(request.getCurrentPassword(), existing.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }
        existing.setPassword(passwordEncoder.encode(request.getNewPassword()));
        employeeRepository.save(existing);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee existing = getEmployeeById(id);
        employeeRepository.delete(existing);
    }
}
