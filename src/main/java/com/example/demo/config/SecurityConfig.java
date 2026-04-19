    package com.example.demo.config;

import com.example.demo.filter.JwtFilter;
import com.example.demo.service.myUserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final myUserDetailService myService;
    private final JwtFilter jwtFilter;
    public SecurityConfig(myUserDetailService myService ,JwtFilter jwtFilter){
        this.myService=myService;
        this.jwtFilter=jwtFilter;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity){
       return  httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth->
                        auth.requestMatchers("/admin/*")
                                .hasRole("ADMIN")
                                .requestMatchers(
                                        "/auth/**",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/swagger-ui.html",
                                        "/actuator/*"
                                ).permitAll()

                                .anyRequest().
                                authenticated()

                )
               .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
               .sessionManagement(session ->
                       session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
               )
                .build();
    }

    @Bean
    public  BCryptPasswordEncoder bCryptPasswordEncoder(){return new BCryptPasswordEncoder();}


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config){
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider= new DaoAuthenticationProvider(myService);
        provider.setPasswordEncoder(new BCryptPasswordEncoder());
        return provider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173")); // Vite dev server ports
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
