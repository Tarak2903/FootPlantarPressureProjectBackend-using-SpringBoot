package com.example.demo.dto;

import lombok.Data;

@Data
public class UserSignInRequest {
    private String userName;
    private String password;

    public UserSignInRequest(String userName,String password){
        this.userName=userName;
        this.password=password;
    }

}
