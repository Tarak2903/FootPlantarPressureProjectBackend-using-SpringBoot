package com.example.demo.dto;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class ErrorResponseDto {

     private String message;
      LocalDateTime time;

      public ErrorResponseDto( String message){

          this.message=message;
          this.time= LocalDateTime.now();
      }
}
