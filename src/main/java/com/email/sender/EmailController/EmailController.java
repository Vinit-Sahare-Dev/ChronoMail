package com.email.sender.EmailController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.email.sender.EmailModel.EmailRequest;
import com.email.sender.EmailService.EmailService;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*") // Add this for frontend requests
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        try {
            System.out.println("Received request: " + emailRequest); // Debug log
            
            // Validate required fields
            if (emailRequest.getReceiversMail() == null || emailRequest.getReceiversMail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Receiver's email is required");
            }
            
            // Send email
            emailService.sendEmail(
                emailRequest.getReceiversMail(), 
                emailRequest.getSubject(), 
                emailRequest.getBody()
            );
            
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception e) {
            e.printStackTrace(); // Debug log
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }
}