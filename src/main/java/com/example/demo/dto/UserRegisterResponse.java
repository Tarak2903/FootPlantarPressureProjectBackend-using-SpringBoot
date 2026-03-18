package com.example.demo.dto;

import lombok.Data;

@Data
public class UserRegisterResponse {
    private String userName;

    public UserRegisterResponse(String userName){
        this.userName=userName;
    }
}
