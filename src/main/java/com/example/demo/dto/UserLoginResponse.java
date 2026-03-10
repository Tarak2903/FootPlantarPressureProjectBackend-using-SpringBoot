package com.example.demo.dto;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class UserLoginResponse {

    private String message;
    LocalDateTime time;

   public  UserLoginResponse(String message){
        this.message=message;
        time=LocalDateTime.now();
    }

}
