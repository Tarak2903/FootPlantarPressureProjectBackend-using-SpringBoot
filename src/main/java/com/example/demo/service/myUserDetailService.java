package com.example.demo.service;

import com.example.demo.entity.UserEntity;

import com.example.demo.entity.UserPrinciple;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class myUserDetailService implements UserDetailsService {

    private final UserRepository userRepo;

    public myUserDetailService(UserRepository userRepo){
        this.userRepo=userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user= userRepo.findByUserName(username);
        if(user==null){
            throw new UsernameNotFoundException("User not Found");
        }
        return new UserPrinciple(user);

    }
}
