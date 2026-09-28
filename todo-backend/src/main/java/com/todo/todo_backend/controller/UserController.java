package com.todo.todo_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo.todo_backend.entity.User;
import com.todo.todo_backend.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            User savedUser = userService.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (RuntimeException e) {

            Map<String, String> response = new HashMap<>();

            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        try {

            User loggedInUser = userService.loginUser(
                    user.getEmail(),
                    user.getPassword()
            );

            // LOGIN SUCCESS
            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("message", "Login successful");
            response.put("id", loggedInUser.getId());
            response.put("name", loggedInUser.getName());
            response.put("email", loggedInUser.getEmail());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            // LOGIN FAILED
            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    // =========================
    // FORGOT PASSWORD - SEND OTP
    // =========================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");

            String message = userService.sendResetOtp(email);

            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("message", message);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // =========================
    // RESET PASSWORD
    // =========================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");
            String otp = request.get("otp");
            String newPassword = request.get("newPassword");

            String message = userService.resetPassword(
                    email,
                    otp,
                    newPassword
            );

            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("message", message);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }
}