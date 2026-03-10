package com.example.demo.exception;


import com.example.demo.dto.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LogicException.class)
    private ResponseEntity<ErrorResponseDto> existingUserConflict(LogicException ex ){
        return new ResponseEntity<>( new ErrorResponseDto(ex.getMessage()),
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(BadCredentialsException.class)
    private ResponseEntity<ErrorResponseDto> UserNotFoundError(BadCredentialsException e){
        return new ResponseEntity<>(new ErrorResponseDto(e.getMessage()),
                HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(FileProcessingException.class)
    private ResponseEntity<ErrorResponseDto> FileError(FileProcessingException e){
        return new ResponseEntity<>(new ErrorResponseDto(e.getMessage()),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(PatientNotFoundException.class)
    private ResponseEntity<ErrorResponseDto> FileError(PatientNotFoundException e){
        return new ResponseEntity<>(new ErrorResponseDto(e.getMessage()),
                HttpStatus.NOT_FOUND);
    }


}
