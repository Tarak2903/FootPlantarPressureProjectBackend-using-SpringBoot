package com.example.demo.exception;


import com.example.demo.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LogicException.class)
    private ResponseEntity<ErrorResponse> existingUserConflict(LogicException ex ){
        return new ResponseEntity<>( new ErrorResponse(ex.getMessage()),
                HttpStatus.CONFLICT);
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


}
