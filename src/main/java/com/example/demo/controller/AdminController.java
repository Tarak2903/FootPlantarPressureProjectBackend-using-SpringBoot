package com.example.demo.controller;

import com.example.demo.dto.UserLoginRequest;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    public AdminController(AdminService adminService){this.adminService=adminService;}
    @GetMapping("/get")
    public ResponseEntity<List<UserEntity>>getUsers(){
        return new ResponseEntity<>(adminService.getAll(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@RequestBody UserLoginRequest userLoginRequest, @PathVariable Long id){
        return new ResponseEntity<>(adminService.updateUser(id,userLoginRequest),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        return new ResponseEntity<>(adminService.removeUser(id),HttpStatus.OK);
    }
}
