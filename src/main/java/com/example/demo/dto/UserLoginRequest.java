package com.example.demo.dto;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String userName;
    private String password;

    public UserLoginRequest(String userName, String password){
        this.userName=userName;
        this.password=password;
    }

}
