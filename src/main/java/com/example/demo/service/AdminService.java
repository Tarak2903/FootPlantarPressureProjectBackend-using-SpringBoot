package com.example.demo.service;

import com.example.demo.dto.AdminRequestEntity;
import com.example.demo.dto.AdminResponseEntity;
import com.example.demo.entity.AdminEntity;
import com.example.demo.exception.BadCredentialsException;
import com.example.demo.exception.LogicException;
import com.example.demo.repository.AdminRepository;
import org.springframework.stereotype.Service;
import java.util.Objects;

@Service
public class AdminService {
    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository){this.adminRepository=adminRepository;}


    public AdminResponseEntity SignUp(AdminRequestEntity adminRequestEntity){
        if(adminRepository.findByEmail(adminRequestEntity.getEmail())!=null)throw new LogicException("Admin Already Exists");
        AdminEntity adminEntity=new AdminEntity(adminRequestEntity.getEmail(),adminRequestEntity.getPassword());
        adminRepository.save(adminEntity);
        return new AdminResponseEntity("Successfully Admin created");
    }

    public AdminResponseEntity LogIn(AdminRequestEntity adminRequestEntity){
        AdminEntity adminEntity=adminRepository.findByEmail(adminRequestEntity.getEmail());
        if(adminEntity==null)throw new BadCredentialsException("Invalid Credentials");
        if(!Objects.equals(adminEntity.getPassword(), adminRequestEntity.getPassword()))throw new BadCredentialsException("Invalid Credentials");
       return new AdminResponseEntity("Successfully Logged in ");
    }


}
