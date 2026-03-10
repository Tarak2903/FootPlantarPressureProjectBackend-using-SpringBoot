package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class PatientEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long Id;
    private String name;
    private String email;
    private String phoneNumber;
    @NotNull
    private double lmean;
    @NotNull
    private double rmean;
    @NotNull
    private double avg;

    public PatientEntity(){}
    public PatientEntity(String name,String email,String phoneNumber,double lmean,double rmean,double avg){
        this.name=name;
        this.email=email;
        this.phoneNumber=phoneNumber;
        this.lmean=lmean;
        this.rmean=rmean;
        this.avg=avg;
    }
}
