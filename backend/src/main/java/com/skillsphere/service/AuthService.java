package com.skillsphere.service;

import com.skillsphere.dto.*;
import com.skillsphere.entity.Employee;
import com.skillsphere.entity.PasswordResetToken;
import com.skillsphere.entity.Role;
import com.skillsphere.exception.EmailAlreadyExistsException;
import com.skillsphere.exception.EmployeeNotFoundException;
import com.skillsphere.exception.InvalidCredentialsException;
import com.skillsphere.exception.InvalidTokenException;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.repository.PasswordResetTokenRepository;
import com.skillsphere.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final List<String> AVATAR_PALETTE = List.of(
            "#2563eb", "#7c3aed", "#0891b2", "#16834b", "#c2410c", "#be185d", "#4338ca", "#0d9488"
    );

    private final EmployeeRepository employeeRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("An account with this email already exists");
        }
        if (employeeRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new EmailAlreadyExistsException("This Employee ID is already registered");
        }

        Employee employee = Employee.builder()
                .employeeId(request.getEmployeeId())
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .phone(request.getPhone())
                .role(Role.EMPLOYEE)
                .avatarColor(randomAvatarColor())
                .build();

        employeeRepository.save(employee);

        String token = jwtService.generateToken(employee);
        return AuthResponse.builder()
                .token(token)
                .employee(EmployeeResponse.fromEntity(employee))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase(), request.getPassword())
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        Employee employee = employeeRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        String token = jwtService.generateToken(employee);
        return AuthResponse.builder()
                .token(token)
                .employee(EmployeeResponse.fromEntity(employee))
                .build();
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new EmployeeNotFoundException("No account found with this email"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .employee(employee)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .used(false)
                .build();
        resetTokenRepository.save(resetToken);

        // NOTE: This project has no email server configured. In a real deployment this
        // token would be emailed to the user. For this demo/assignment build, the token
        // (and the reset link the frontend can use) is returned directly so the flow can
        // be demonstrated end-to-end without external services.
        return token;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid or unknown reset token"));

        if (resetToken.isUsed()) {
            throw new InvalidTokenException("This reset token has already been used");
        }
        if (resetToken.isExpired()) {
            throw new InvalidTokenException("This reset token has expired. Please request a new one.");
        }

        Employee employee = resetToken.getEmployee();
        employee.setPassword(passwordEncoder.encode(request.getNewPassword()));
        employeeRepository.save(employee);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }

    private String randomAvatarColor() {
        return AVATAR_PALETTE.get((int) (Math.random() * AVATAR_PALETTE.size()));
    }
}
