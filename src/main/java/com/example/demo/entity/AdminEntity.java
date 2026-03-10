package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Entity
@Data
public class AdminEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long employeeId;
    @Email
    private String email;
    private String password;
    public AdminEntity(){}
    public AdminEntity(String email,String password){
        this.email=email;
        this.password=password;
    }

}
