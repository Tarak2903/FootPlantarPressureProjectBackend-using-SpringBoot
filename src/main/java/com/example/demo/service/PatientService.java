package com.example.demo.service;

import com.example.demo.dto.PatientRequest;
import com.example.demo.entity.PatientEntity;
import com.example.demo.exception.PatientNotFoundException;
import com.example.demo.repository.PatientRepository;
import com.example.demo.util.FileProcessingUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.mail.MessagingException;
import java.io.IOException;


@Service
public class PatientService {

private final PatientRepository patientRepository;
private final MailService mailService;

public PatientService(PatientRepository patientRepository, MailService mailService) {
    this.patientRepository = patientRepository;
    this.mailService = mailService;
}

    public com.example.demo.dto.PressureResponse processFile(PatientRequest patientRequest)throws IOException{
        MultipartFile file= patientRequest.getFile();
        com.example.demo.dto.PressureResponse pressureResponse = FileProcessingUtil.filProcessor(file);
        double lmean = pressureResponse.getLmean();
        double rmean = pressureResponse.getRmean();
        double avg = pressureResponse.getAvg();
        String name= patientRequest.getName();
        String email= patientRequest.getEmail();
        String phoneNumber= patientRequest.getPhoneNumber();
        PatientEntity patient = new PatientEntity(name,email,phoneNumber,lmean,rmean,avg);
        patientRepository.save(patient);
        return pressureResponse;
    }
    public com.example.demo.dto.PatientDetailResponse processExistingUser(String phoneNumber) {
        PatientEntity patient = patientRepository.findByPhoneNumber(phoneNumber);
        if(patient == null) throw new PatientNotFoundException("No data exists for given phone number");
        return new com.example.demo.dto.PatientDetailResponse(patient.getName(), patient.getEmail(), patient.getPhoneNumber(), patient.getLmean(), patient.getRmean(), patient.getAvg());
    }

    public void sendReportPdfToPatient(String phoneNumber, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PDF file is required");
        }
        String lowerName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String ct = file.getContentType();
        boolean looksPdf = lowerName.endsWith(".pdf")
                || (ct != null && (ct.equalsIgnoreCase("application/pdf") || ct.equalsIgnoreCase("application/x-pdf")));
        if (!looksPdf) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must be a PDF");
        }

        PatientEntity patient = patientRepository.findByPhoneNumber(phoneNumber);
        if (patient == null) {
            throw new PatientNotFoundException("No patient found for this phone number");
        }
        if (patient.getEmail() == null || patient.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient has no email on file");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read PDF file");
        }
        if (bytes.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty PDF file");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank()) {
            filename = "plantar-pressure-report.pdf";
        }
        try {
            mailService.sendPdfReport(patient.getEmail(), patient.getName(), bytes, filename);
        } catch (MessagingException e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Failed to send email. Configure MAIL_USERNAME / MAIL_PASSWORD (or spring.mail.*) and try again."
            );
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }
    }

}
