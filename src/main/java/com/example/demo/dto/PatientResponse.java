package com.example.demo.dto;

import lombok.Data;

@Data
public class PatientResponse {
    private double lmean,rmean,avg;
    public PatientResponse(Double lmean, Double rmean, Double avg ){
        this.lmean=lmean;
        this.rmean=rmean;
        this.avg=avg;
    }
}
