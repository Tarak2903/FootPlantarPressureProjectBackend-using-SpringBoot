package com.example.demo.service;
import com.example.demo.dto.UserSignInRequest;
import com.example.demo.dto.UserSignUpRequest;
import com.example.demo.dto.UserResponseDto;
import com.example.demo.entity.UserEntity;
import com.example.demo.exception.BadCredentialsException;
import com.example.demo.exception.LogicException;
import com.example.demo.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder encoder,AuthenticationManager authManager,JwtService jwtService){
        this.userRepository=userRepository;
        this.encoder=encoder;
        this.authManager=authManager;
        this.jwtService=jwtService;
    }


    public UserResponseDto addUser(UserSignUpRequest user){
        if(userRepository.findByUserName(user.getUserName())!=null)throw new LogicException("User already Exist");
        UserEntity userEntity=new UserEntity(user.getUserName(),encoder.encode(user.getPassword()),user.getRole());
        userRepository.save(userEntity);
        return new UserResponseDto(user.getUserName());
    }

    public String signIn(UserSignInRequest user){
        Authentication auth= authManager.authenticate
                (new UsernamePasswordAuthenticationToken(user.getUserName(),user.getPassword()));
        if(!auth.isAuthenticated())throw new BadCredentialsException("Invalid Credentials");

        return jwtService.generateToken(user.getUserName());

    }


    public List<UserEntity> getUsers(){
        return  userRepository.findAll();
    }

}
