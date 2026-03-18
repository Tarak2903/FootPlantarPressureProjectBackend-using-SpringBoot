package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {

     private String message;
      LocalDateTime time;

      public ErrorResponse(String message){

          this.message=message;
          this.time= LocalDateTime.now();
      }
}
