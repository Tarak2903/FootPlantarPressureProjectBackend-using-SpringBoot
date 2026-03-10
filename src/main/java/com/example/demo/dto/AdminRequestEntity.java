package com.example.demo.dto;


import lombok.Data;

@Data
public class AdminRequestEntity {
    private String email;
    private String password;

    public AdminRequestEntity(String email,String password){
        this.email=email;
        this.password=password;
    }

}
