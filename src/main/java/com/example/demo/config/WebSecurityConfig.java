package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity){

        httpSecurity.authorizeHttpRequests(auth-> auth
                .requestMatchers("/user/**").permitAll()
                        .requestMatchers("/patient/**").authenticated())
                .formLogin(Customizer.withDefaults());

        return httpSecurity.build();
    }

}
