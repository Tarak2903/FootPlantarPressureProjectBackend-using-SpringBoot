package com.example.demo.dto;

import lombok.Data;

@Data
public class UserResponseDto {
    private String userName;

    public UserResponseDto(String userName){
        this.userName=userName;
    }
}
