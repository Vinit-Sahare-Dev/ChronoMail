package com.email.sender.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        // Validate input parameters
        if (to == null || to.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient email cannot be null or empty");
        }
        
        // Provide default values for optional fields
        String safeSubject = (subject != null) ? subject : "No Subject";
        String safeBody = (body != null) ? body : "";
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(safeSubject);
        message.setText(safeBody);
        
        mailSender.send(message);
    }
}