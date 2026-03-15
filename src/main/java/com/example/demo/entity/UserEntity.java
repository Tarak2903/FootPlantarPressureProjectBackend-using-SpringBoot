package com.example.demo.entity;
 import com.example.demo.enums.Role;
 import jakarta.persistence.*;

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
    @Enumerated(EnumType.STRING)
    private Role role;
    public UserEntity(String userName,String password,Role role){
        this.userName=userName;
        this.password=password;
        this.role=role;
    }

}
