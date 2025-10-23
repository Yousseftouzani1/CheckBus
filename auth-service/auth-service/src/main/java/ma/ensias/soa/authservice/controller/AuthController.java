package ma.ensias.soa.authservice.controller;

import ma.ensias.soa.authservice.dto.*;
import ma.ensias.soa.authservice.exceptions.InvalidTokenException;
import ma.ensias.soa.authservice.exceptions.UnauthorizedException;
import ma.ensias.soa.authservice.service.AuthService;
import ma.ensias.soa.authservice.security.JwtUtil;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;



@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    private final JwtUtil jwtUtil ;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest request) {
        authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully. Please check your email for verification.");
    }

    @GetMapping("/verify")
    public ResponseEntity<AuthResponse> verifyUser(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || token.isEmpty()) {
            throw new UnauthorizedException("No token found. Please log in.");
        }

        String email = jwtUtil.extractEmail(token);

        if (!jwtUtil.validateToken(token, email)) {
            throw new InvalidTokenException("Invalid or expired token.");
        }

        AuthResponse response = new AuthResponse(true,"Token is valid. User authenticated." );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse loginResponse = authService.loginUser(request);
        authService.attachAuthCookie(response, loginResponse.getToken(), request.getRemember_me());
        return ResponseEntity.ok(loginResponse);
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        authService.forgetPassword(request.getEmail());
        ApiResponse response = new ApiResponse( "Password reset email sent if the email exists.");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/verify-token")
    public ResponseEntity<?> verifyEmailToken (@Valid @RequestParam VerifyTokenRequest request) {
        authService.VerifyEmailToken(request.getToken());
        ApiResponse response = new ApiResponse( "Token verified successfully.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        ApiResponse response = new ApiResponse("Password has been reset successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.VerifyEmailToken(request.getToken());
        ApiResponse response = new ApiResponse("Email verified successfully. You can now login.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendEmailVerification(request.getEmail());
        ApiResponse response = new ApiResponse("Verification email has been resent");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<ValidationResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid authorization header");
        }
        
        String token = authHeader.substring(7);
        authService.isAuthenticated(token);
        String email = jwtUtil.extractEmail(token);
        
        ValidationResponse response = new ValidationResponse(
            true,
            email,
            "Token is valid"
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletResponse response) {
        authService.attachAuthCookie(response, "", false);
        ApiResponse apiResponse = new ApiResponse("Logged out successfully");
        return ResponseEntity.ok(apiResponse);
    }
    

    



}
