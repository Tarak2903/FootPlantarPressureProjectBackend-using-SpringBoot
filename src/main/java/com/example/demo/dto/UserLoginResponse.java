package com.example.demo.dto;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class UserLoginResponse {

    private String token;
    private String role;
    LocalDateTime time;

   public UserLoginResponse(String token, String role){
        this.token=token;
        this.role=role;
        this.time=LocalDateTime.now();
    }

}
