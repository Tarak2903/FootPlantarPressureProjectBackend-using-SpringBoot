package com.example.demo.dto;


import com.example.demo.enums.Role;
import lombok.Data;

@Data
public class UserRegisterRequest {
    private String userName;
    private String password;
    private Role role;


}
