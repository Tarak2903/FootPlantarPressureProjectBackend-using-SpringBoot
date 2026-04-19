package com.example.demo.service;

import com.example.demo.dto.UserLoginRequest;
import com.example.demo.entity.UserEntity;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    public AdminService(UserRepository userRepo, BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public String removeUser(Long id) {
        Optional<UserEntity> user = userRepo.findById(id);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        userRepo.delete(user.get());
        return ("Success");
    }

    public String updateUser(Long id, UserLoginRequest updatedUser) {
        Optional<UserEntity> optionalUser = userRepo.findById(id);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        UserEntity existingUser = optionalUser.get();
        existingUser.setUserName(updatedUser.getUserName());
        existingUser.setPassword(encoder.encode(updatedUser.getPassword()));
        userRepo.save(existingUser);
        return ("SuccessFully Updated");
    }

    public List<UserEntity> getAll() {return userRepo.findAll();}
}

