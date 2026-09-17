package com.skillsphere.config;

import com.skillsphere.exception.EmployeeNotFoundException;
import com.skillsphere.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final EmployeeRepository employeeRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException("No account found for email: " + email));
    }
}
