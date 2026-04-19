package com.example.demo.service;

import com.example.demo.dto.PatientRequest;
import com.example.demo.dto.PatientResponse;
import com.example.demo.entity.PatientEntity;
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

    public PatientResponse processFile(PatientRequest patientRequest)throws IOException{
        MultipartFile file= patientRequest.getFile();
        List<Double> x= FileProcessingUtil.filProcessor(file);
        double lmean=x.get(0),rmean=x.get(1),avg=x.get(2);
        String name= patientRequest.getName();
        String email= patientRequest.getEmail();
        String phoneNumber= patientRequest.getPhoneNumber();
        PatientEntity patient = new PatientEntity(name,email,phoneNumber,lmean,rmean,avg);
        patientRepository.save(patient);
        return new PatientResponse(lmean,rmean,avg);
    }
    public com.example.demo.dto.PatientDetailResponse processExistingUser(String phoneNumber) {
        PatientEntity patient = patientRepository.findByPhoneNumber(phoneNumber);
        if(patient == null) throw new PatientNotFoundException("No data exists for given phone number");
        return new com.example.demo.dto.PatientDetailResponse(patient.getName(), patient.getEmail(), patient.getPhoneNumber(), patient.getLmean(), patient.getRmean(), patient.getAvg());
    }

}
