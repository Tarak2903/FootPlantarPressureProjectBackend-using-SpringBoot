package com.example.demo.dto;

import lombok.Data;

@Data
public class PatientDetailResponse {
    private String name;
    private String email;
    private String phoneNumber;
    private double lmean;
    private double rmean;
    private double avg;

    public PatientDetailResponse(String name, String email, String phoneNumber, double lmean, double rmean, double avg) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.lmean = lmean;
        this.rmean = rmean;
        this.avg = avg;
    }
}
