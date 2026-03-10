package com.example.demo.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PatientRequestDto {

    private String name;
    private String email;
    private String phoneNumber;
    private MultipartFile file;

    public PatientRequestDto(String name,String email,String phoneNumber,MultipartFile file){
        this.file=file;
        this.email=email;
        this.phoneNumber=phoneNumber;
        this.name=name;
    }


}
