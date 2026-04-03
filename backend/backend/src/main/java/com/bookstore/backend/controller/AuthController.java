package com.bookstore.backend.controller;

import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String result = authService.register(user);

        if (result.equals("Register success")) {
            return ResponseEntity.ok(result); // 200
        } else {
            return ResponseEntity.badRequest().body(result); // 400
        }
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        String result = authService.login(user);

        if (result.equals("Login success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(401).body(result); // unauthorized
        }
    }



    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}