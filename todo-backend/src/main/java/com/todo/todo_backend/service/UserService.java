package com.todo.todo_backend.service;

import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.todo.todo_backend.entity.User;
import com.todo.todo_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER
    // =========================

    public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        return userRepository.save(user);
    }


    // =========================
    // LOGIN
    // =========================

    public User loginUser(String email, String password) {

        // Check whether email exists
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            throw new RuntimeException(
                    "Email not registered. Please register first."
            );
        }


        // Check password
        if (!user.getPassword().equals(password)) {

            throw new RuntimeException(
                    "Incorrect password"
            );
        }


        // Login successful
        return user;
    }


    // =========================
    // FORGOT PASSWORD
    // SEND OTP
    // =========================

    public String sendResetOtp(String email) {

        if (email == null || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        String cleanEmail = email.trim();

        Optional<User> optionalUser =
                userRepository.findByEmail(cleanEmail);

        if (optionalUser.isEmpty()) {

            throw new RuntimeException(
                    "Email not registered. Please check your email."
            );
        }

        User user = optionalUser.get();

        // Generate 6 digit OTP
        String otp = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );

        // OTP expires after 5 minutes
        long expiryTime =
                System.currentTimeMillis()
                + (5 * 60 * 1000);

        user.setResetOtp(otp);
        user.setResetOtpExpiry(expiryTime);

        userRepository.save(user);

        // Show OTP in Spring Boot terminal for testing
        System.out.println(
                "=========================================="
        );

        System.out.println(
                "PASSWORD RESET OTP"
        );

        System.out.println(
                "Email : " + cleanEmail
        );

        System.out.println(
                "OTP   : " + otp
        );

        System.out.println(
                "Valid for 5 minutes"
        );

        System.out.println(
                "=========================================="
        );

        return "OTP generated successfully.";
    }


    // =========================
    // RESET PASSWORD
    // =========================

    public String resetPassword(
            String email,
            String otp,
            String newPassword
    ) {

        if (email == null || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        if (otp == null || otp.trim().isEmpty()) {

            throw new RuntimeException(
                    "OTP is required"
            );
        }

        if (newPassword == null
                || newPassword.trim().isEmpty()) {

            throw new RuntimeException(
                    "New password is required"
            );
        }

        if (newPassword.length() < 6) {

            throw new RuntimeException(
                    "Password must be at least 6 characters"
            );
        }

        String cleanEmail = email.trim();
        String cleanOtp = otp.trim();

        User user =
                userRepository.findByEmail(cleanEmail)
                .orElse(null);

        if (user == null) {

            throw new RuntimeException(
                    "Email not registered."
            );
        }

        // Check whether OTP exists
        if (user.getResetOtp() == null) {

            throw new RuntimeException(
                    "No OTP found. Please request a new OTP."
            );
        }

        // Check OTP
        if (!user.getResetOtp().equals(cleanOtp)) {

            throw new RuntimeException(
                    "Invalid OTP."
            );
        }

        // Check OTP expiry
        if (user.getResetOtpExpiry() == null) {

            throw new RuntimeException(
                    "OTP expired. Please request a new OTP."
            );
        }

        if (System.currentTimeMillis()
                > user.getResetOtpExpiry()) {

            // Clear expired OTP
            user.setResetOtp(null);
            user.setResetOtpExpiry(null);

            userRepository.save(user);

            throw new RuntimeException(
                    "OTP expired. Please request a new OTP."
            );
        }

        // Change password
        user.setPassword(newPassword);

        // Clear OTP after successful password change
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);

        return "Password changed successfully.";
    }
}