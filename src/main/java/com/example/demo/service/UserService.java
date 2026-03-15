package com.example.demo.service;
import com.example.demo.dto.UserLoginResponse;
import com.example.demo.dto.UserSignUpRequest;
import com.example.demo.dto.UserResponseDto;
import com.example.demo.entity.UserEntity;
import com.example.demo.exception.BadCredentialsException;
import com.example.demo.exception.LogicException;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    public UserService(UserRepository userRepository, BCryptPasswordEncoder encoder){
        this.userRepository=userRepository;
        this.encoder=encoder;
    }


    public UserResponseDto addUser(UserSignUpRequest user){
        if(userRepository.findByUserName(user.getUserName())!=null)throw new LogicException("User already Exist");
        UserEntity userEntity=new UserEntity(user.getUserName(),encoder.encode(user.getPassword()),user.getRole());
        userRepository.save(userEntity);
        return new UserResponseDto(user.getUserName());
    }

    public UserLoginResponse signIn(UserSignUpRequest user){
        UserEntity realUser= userRepository.findByUserName(user.getUserName());
        if(realUser==null)throw new BadCredentialsException("Invalid Credentials");
        if (!realUser.getPassword().equals(user.getPassword()))throw new BadCredentialsException("Invalid Credentials");
        return new UserLoginResponse("User Successfully Authenticated");
    }


    public List<UserEntity> getUsers(){
        return userRepository.findAll();
    }

}
