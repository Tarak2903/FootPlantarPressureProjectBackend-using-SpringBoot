package com.example.demo.dto;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class UserLoginResponse {

    private String token;
    LocalDateTime time;

   public  UserLoginResponse(String token){
        this.token=token;
        time=LocalDateTime.now();
    }

}
