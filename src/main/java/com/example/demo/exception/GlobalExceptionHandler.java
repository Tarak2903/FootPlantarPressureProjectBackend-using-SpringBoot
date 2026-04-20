package com.example.demo.exception;


import com.example.demo.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.ConstraintViolationException;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.stream.Collectors;


@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LogicException.class)
    private ResponseEntity<ErrorResponse> existingUserConflict(LogicException ex ){
        return new ResponseEntity<>( new ErrorResponse(ex.getMessage()),
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResponseStatusException.class)
    private ResponseEntity<ErrorResponse> handleResponseStatus(ResponseStatusException ex) {
        String msg = ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString();
        return new ResponseEntity<>(new ErrorResponse(msg), ex.getStatusCode());
    }

    @ExceptionHandler(BadCredentialsException.class)
    private ResponseEntity<ErrorResponse> UserNotFoundError(BadCredentialsException e){
        return new ResponseEntity<>(new ErrorResponse(e.getMessage()),
                HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(FileProcessingException.class)
    private ResponseEntity<ErrorResponse> FileError(FileProcessingException e){
        return new ResponseEntity<>(new ErrorResponse(e.getMessage()),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(PatientNotFoundException.class)
    private ResponseEntity<ErrorResponse> FileError(PatientNotFoundException e){
        return new ResponseEntity<>(new ErrorResponse(e.getMessage()),
                HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(UserNotFoundException.class)
    private ResponseEntity<ErrorResponse> FileError(UserNotFoundException e){
        return new ResponseEntity<>(new ErrorResponse(e.getMessage()),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    private ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException e) {
        String cleanMessage = e.getConstraintViolations().stream()
                .map(violation -> violation.getMessage())
                .collect(Collectors.joining(", "));
        return new ResponseEntity<>(new ErrorResponse(cleanMessage), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<ErrorResponse>handleSqlConstraintViolation(SQLIntegrityConstraintViolationException e){
        return new ResponseEntity<>(new ErrorResponse("Duplicate Entry"),HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(io.jsonwebtoken.ExpiredJwtException.class)
    private ResponseEntity<ErrorResponse> handleExpiredJwtException(io.jsonwebtoken.ExpiredJwtException ex) {
        return new ResponseEntity<>(new ErrorResponse("Session expired. Please log in again."), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(io.jsonwebtoken.JwtException.class)
    private ResponseEntity<ErrorResponse> handleJwtException(io.jsonwebtoken.JwtException ex) {
        return new ResponseEntity<>(new ErrorResponse("Invalid or malformed token."), HttpStatus.UNAUTHORIZED);
    }

}
