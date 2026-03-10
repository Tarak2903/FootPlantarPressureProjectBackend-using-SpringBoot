package com.example.demo.service;

import com.example.demo.dto.PatientRequestDto;
import com.example.demo.dto.PatientResponseDto;
import com.example.demo.entity.PatientEntity;
import com.example.demo.exception.FileProcessingException;
import com.example.demo.exception.PatientNotFoundException;
import com.example.demo.repository.PatientRepository;
import com.example.demo.util.FileProcessingUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;


@Service
public class PatientService {

private final PatientRepository patientRepository;
public PatientService(PatientRepository patientRepository) {this.patientRepository=patientRepository;}

    public PatientResponseDto processFile(PatientRequestDto patientRequestDto)throws IOException{
        MultipartFile file=patientRequestDto.getFile();
        List<Double> x= FileProcessingUtil.filProcessor(file);
        double lmean=x.get(0),rmean=x.get(1),avg=x.get(2);
        String name=patientRequestDto.getName();
        String email=patientRequestDto.getEmail();
        String phoneNumber=patientRequestDto.getPhoneNumber();
        PatientEntity patient = new PatientEntity(name,email,phoneNumber,lmean,rmean,avg);
        patientRepository.save(patient);
        return new PatientResponseDto(lmean,rmean,avg);
    }
    public PatientResponseDto processExistingUser(String email){
        PatientEntity patient= patientRepository.findByEmail(email);
        if(patient==null)throw new PatientNotFoundException("No data Exists for given email");

        return new PatientResponseDto(patient.getLmean(),patient.getRmean(),patient.getAvg());

    }

}
