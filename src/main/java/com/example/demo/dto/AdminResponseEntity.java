package com.example.demo.dto;

import lombok.Data;

@Data
public class AdminResponseEntity {

    private String message;
    public AdminResponseEntity(String message){this.message=message;}

}
