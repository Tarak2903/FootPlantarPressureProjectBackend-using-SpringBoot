package com.example.demo.entity;
 import jakarta.persistence.Entity;

 import jakarta.persistence.GeneratedValue;
 import jakarta.persistence.GenerationType;
 import jakarta.persistence.Id;
 import jakarta.validation.constraints.Email;
 import jakarta.validation.constraints.NotNull;
 import lombok.AllArgsConstructor;
 import lombok.Data;
 import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Email(message="This field should have email id")
    private String userName;
    @NotNull
    private String password;
    public UserEntity(String userName,String password){
        this.userName=userName;
        this.password=password;
    }

}
