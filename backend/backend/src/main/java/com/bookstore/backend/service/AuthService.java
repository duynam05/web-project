package com.bookstore.backend.service;

import com.bookstore.backend.entity.Role;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepo;

    public AuthService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public String register(User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists";
        }
        user.setRole(Role.USER);
        userRepo.save(user);
        return "Register success";
    }

    public String login(User user) {
        return userRepo.findByEmail(user.getEmail())
                .filter(u -> u.getPassword().equals(user.getPassword()))
                .map(u -> "Login success - Role: " + u.getRole())
                .orElse("Login failed");
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
