package com.example.demo.controller;

import com.example.demo.dto.AdminRequestEntity;
import com.example.demo.dto.AdminResponseEntity;
import com.example.demo.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
private final AdminService adminService;

public AdminController(AdminService adminService){this.adminService=adminService;}

    @PostMapping
    public ResponseEntity<AdminResponseEntity> signUp(AdminRequestEntity admin){
        return new ResponseEntity<>(adminService.SignUp(admin), HttpStatus.CREATED);
    }

    @PostMapping("/Login")
    public ResponseEntity<AdminResponseEntity> login(AdminRequestEntity admin){
            return new ResponseEntity<>(adminService.LogIn(admin),HttpStatus.ACCEPTED);
    }

}
