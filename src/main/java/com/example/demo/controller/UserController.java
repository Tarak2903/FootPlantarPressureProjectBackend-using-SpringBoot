package com.example.demo.controller;


import com.example.demo.dto.UserLoginResponse;
import com.example.demo.dto.UserSignUpRequest;
import com.example.demo.dto.UserResponseDto;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
        public UserController(UserService userService){
            this.userService=userService;

        }


    @PostMapping("/SignUp")
    public ResponseEntity<UserResponseDto> Signup(@RequestBody UserSignUpRequest user){
            return new ResponseEntity<>(userService.addUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/Login")
    public ResponseEntity<String> Login(@RequestBody UserSignUpRequest user){
            return new ResponseEntity<>(userService.signIn(user),HttpStatus.ACCEPTED);
    }


    @GetMapping
    public List<UserEntity> getUsers(){
            return userService.getUsers();
    }
}
