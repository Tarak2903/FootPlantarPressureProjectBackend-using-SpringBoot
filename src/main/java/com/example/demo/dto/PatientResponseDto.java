package com.example.demo.dto;

import lombok.Data;

@Data
public class PatientResponseDto {
    private double lmean,rmean,avg;
    public PatientResponseDto(Double lmean,Double rmean,Double avg ){
        this.lmean=lmean;
        this.rmean=rmean;
        this.avg=avg;
    }
}
