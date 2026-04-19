package com.example.demo.repository;

import com.example.demo.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<PatientEntity,Long> {
    PatientEntity findByEmail(String email);
    PatientEntity findByPhoneNumber(String phoneNumber);
}
