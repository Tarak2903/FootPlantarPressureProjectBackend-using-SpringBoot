package com.example.demo.controller;

import com.example.demo.dto.PatientRequest;
import com.example.demo.dto.PatientResponse;
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
    public ResponseEntity<PatientResponse> getExistingPatient(@RequestParam  String email){
        return new ResponseEntity<>(patientService.processExistingUser(email), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PatientResponse> addNewPatient(@ModelAttribute PatientRequest patientRequest) throws IOException {

        return new ResponseEntity<>(patientService.processFile(patientRequest),HttpStatus.OK);
    }

    @GetMapping("/h")
    public String getHello(){return "Lesgoooooo";}

}
