package ma.ensias.soa.authservice.service;

import ma.ensias.soa.authservice.entity.UserAuth;


import org.springframework.stereotype.Service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import ma.ensias.soa.authservice.exceptions.EmailSendException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.util.Map;


@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendPasswordResetToken(UserAuth user, String token) {
        Context context = new Context();
        context.setVariables(
                Map.of(
                        "username", user.getUsername(),
                        "token", token,
                        "expriration", "15 minutes"
                )
        );
        String htmlContent = templateEngine.process("reset-password.html", context);
        sendHTMLEmail(
                user.getEmail(),
                "Password Reset Token",
                htmlContent
        );
    }

    
    public void sendEmailVerification(UserAuth user, String token) {
        Context context = new Context();
        context.setVariables(Map.of(
                "userEmail", user.getEmail(),
                "token", token,
                "expiration", "24 hours"
        ));

        String htmlContent = templateEngine.process("verify-email.html", context);
        sendHTMLEmail(user.getEmail(), "Verify Your Email Address", htmlContent);
    }






    public void sendHTMLEmail(String to, String subject, String HtmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(HtmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
            throw new EmailSendException("Failed to send email", e);
        }
    }

}
