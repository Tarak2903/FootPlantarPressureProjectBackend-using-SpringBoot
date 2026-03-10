package com.example.demo.controller;

import com.example.demo.dto.PatientRequestDto;
import com.example.demo.dto.PatientResponseDto;
import com.example.demo.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService){this.patientService=patientService;}
    @GetMapping
    public ResponseEntity<PatientResponseDto> getExistingPatient(@RequestParam  String email){
        return new ResponseEntity<>(patientService.processExistingUser(email), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PatientResponseDto> addNewPatient(@ModelAttribute PatientRequestDto patientRequest) throws IOException {

        return new ResponseEntity<>(patientService.processFile(patientRequest),HttpStatus.OK);
    }

}
