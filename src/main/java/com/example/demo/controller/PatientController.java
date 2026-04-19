package com.example.demo.controller;

import com.example.demo.dto.PatientRequest;
import com.example.demo.dto.PatientDetailResponse;
import com.example.demo.dto.PatientResponse;
import com.example.demo.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.PatientService;

import java.io.IOException;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService){this.patientService=patientService;}
    @GetMapping
    public ResponseEntity<PatientDetailResponse> getExistingPatient(@RequestParam String phoneNumber) {
        return new ResponseEntity<>(patientService.processExistingUser(phoneNumber), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<com.example.demo.dto.PressureResponse> addNewPatient(@ModelAttribute PatientRequest patientRequest) throws IOException {

        return new ResponseEntity<>(patientService.processFile(patientRequest),HttpStatus.OK);
    }

    @GetMapping("/h")
    public String getHello(){return "Lesgoooooo";}

}
