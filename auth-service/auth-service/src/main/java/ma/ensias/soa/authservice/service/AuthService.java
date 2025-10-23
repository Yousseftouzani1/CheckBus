package ma.ensias.soa.authservice.service;


import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.boot.autoconfigure.security.saml2.Saml2RelyingPartyProperties.AssertingParty.Verification;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import ma.ensias.soa.authservice.repository.UserAuthRepository;
import ma.ensias.soa.authservice.repository.VerificationTokenRepository;
import ma.ensias.soa.authservice.entity.UserAuth;
import ma.ensias.soa.authservice.entity.VerificationToken;
import ma.ensias.soa.authservice.exceptions.InvalidTokenException;
import ma.ensias.soa.authservice.exceptions.UserNotFoundException;
import ma.ensias.soa.authservice.dto.RegisterRequest;
import ma.ensias.soa.authservice.dto.LoginRequest;
import ma.ensias.soa.authservice.dto.LoginResponse;
import ma.ensias.soa.authservice.security.JwtUtil;
import ma.ensias.soa.authservice.Enums.*;


@Slf4j
@AllArgsConstructor
@Service
public class AuthService {
    private final UserAuthRepository userAuthRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil ;
    private final EmailService emailService ;
    private final VerificationTokenRepository verificationTokenRepository ;

    private static  int time_rememberme_true = 30 * 24 * 3600;
    private static  int time_rememberme_false = -1;


  

    public UserAuth registerUser(RegisterRequest request) {
        if(userAuthRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email already in use");
        }
        
        UserAuth userAuth = new UserAuth();
        userAuth.setUsername(request.getUsername());
        userAuth.setEmail(request.getEmail());
        userAuth.setPassword(passwordEncoder.encode(request.getPassword())); 
        userAuth.setIsActive(false);

        UserAuth savedUser = userAuthRepository.save(userAuth);

        VerificationToken token = new VerificationToken();     
        token.setToken(generateShortToken());
        token.setEmail(savedUser.getEmail());
        token.setType(TokenType.CONFIRM_EMAIL);
        token.setExpiresAt(LocalDateTime.now().plusHours(24));
        verificationTokenRepository.save(token);


        emailService.sendEmailVerification(savedUser, token.getToken());

        return savedUser;
    }

    public LoginResponse loginUser(LoginRequest request) {
        UserAuth userAuth = userAuthRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), userAuth.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        if (!userAuth.getIsActive()) {
            throw new IllegalArgumentException("User account is inactive");
        }

        String token = jwtUtil.generateToken(userAuth, request.getRemember_me());

        LoginResponse loginResponse = new LoginResponse(
            token,
            userAuth.getUsername(),
            userAuth.getEmail(),
            request.getRemember_me()); 

        return loginResponse;
    }


    public void forgetPassword(String email){
        UserAuth user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));

        VerificationToken token = new VerificationToken();
        token.setToken(generateShortToken());     
        token.setEmail(user.getEmail());   
        token.setType(TokenType.RESET_PASSWORD);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));

        verificationTokenRepository.save(token);
        
        emailService.sendPasswordResetToken(user, token.getToken());

    }


    public void resetPassword(String token, String newPassword){
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired token"));

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now()) || verificationToken.isUsed()) {
            throw new InvalidTokenException("Invalid or expired token");
        }

        UserAuth user = userAuthRepository.findByEmail(verificationToken.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userAuthRepository.save(user);

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);
    }

    public void VerifyEmailToken(String token){
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid confirmation token"));

        if (verificationToken.isUsed() || verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Token expired or already used");
        }

        UserAuth user = userAuthRepository.findByEmail(verificationToken.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found for this token"));

        user.setIsActive(true);
        userAuthRepository.save(user);

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);
    }


    public void sendEmailVerification(UserAuth user){
        VerificationToken token = new VerificationToken();     
        token.setEmail(user.getEmail());   
        token.setType(TokenType.CONFIRM_EMAIL);
        token.setExpiresAt(LocalDateTime.now().plusHours(24));

        verificationTokenRepository.save(token);
        
        emailService.sendEmailVerification(user, token.getToken());
    }


    public void confirmEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid confirmation token"));

        if (verificationToken.isUsed() || verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Token expired or already used");
        }

        UserAuth user = userAuthRepository.findByEmail(verificationToken.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found for this token"));

        user.setIsActive(true);
        userAuthRepository.save(user);

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);
    }


    public void attachAuthCookie(HttpServletResponse response, String token, boolean rememberMe) {
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        if (rememberMe) {
            cookie.setMaxAge(time_rememberme_true); // 30 days
            log.info("Created persistent authentication cookie (30 days)");
        } else {
            cookie.setMaxAge(time_rememberme_false); // Session cookie
            log.info("Created session authentication cookie (browser session only)");
        }
        response.addCookie(cookie);
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }



    public Boolean isAuthenticated(String token){
        String email = jwtUtil.extractEmail(token) ;
        Boolean isTokenValid = jwtUtil.validateToken(token, email) ;
        Boolean userExists = userAuthRepository.existsByEmail(email) ;
        if(!isTokenValid){
            throw new InvalidTokenException("Invalid or Expired token");
        }

        if (!userExists){
            throw new UserNotFoundException("User not found");
        }
        
        
        return true ;
    }


    private String generateShortToken() {
        return UUID.randomUUID().toString().replace("-", "")
                .substring(0, 8).toUpperCase(); 
    }


    
    public void resendEmailVerification(String email) {
        UserAuth user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
        
        if (user.getIsActive()) {
            throw new IllegalArgumentException("User account is already verified");
        }
        
        sendEmailVerification(user);
}
    
    
}
