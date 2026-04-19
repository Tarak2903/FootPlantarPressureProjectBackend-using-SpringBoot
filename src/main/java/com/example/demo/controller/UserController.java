package com.example.demo.controller;


import com.example.demo.dto.UserLoginResponse;
import com.example.demo.dto.UserLoginRequest;
import com.example.demo.dto.UserRegisterRequest;
import com.example.demo.dto.UserRegisterResponse;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class UserController {
    private final UserService userService;
        public UserController(UserService userService){
            this.userService=userService;

        }


    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponse> Signup(@RequestBody UserRegisterRequest user){
            return new ResponseEntity<>(userService.addUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> Login(@RequestBody UserLoginRequest user){
            String token = userService.signIn(user);
            UserEntity userEntity = userService.getUserByUserName(user.getUserName());
            return new ResponseEntity<>(new UserLoginResponse(token, userEntity.getRole().name()), HttpStatus.ACCEPTED);
    }


    @GetMapping("/get")
    public List<UserEntity> getUsers(){
            return userService.getUsers();
    }
}
