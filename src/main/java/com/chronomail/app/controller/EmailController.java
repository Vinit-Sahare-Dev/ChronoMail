package com.chronomail.app.controller;

import com.chronomail.app.model.EmailRequest;
import com.chronomail.app.model.EmailSchedule;
import com.chronomail.app.model.EmailScheduleRequest;
import com.chronomail.app.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EmailController {

    @Autowired
    private EmailService emailService;

    // Immediate email sending
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendEmail(@Valid @RequestBody EmailRequest emailRequest) {
        try {
            emailService.sendEmail(
                emailRequest.getReceiversMail(), 
                emailRequest.getSubject(), 
                emailRequest.getBody()
            );
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email sent successfully!");
            response.put("status", "SUCCESS");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to send email: " + e.getMessage());
            response.put("status", "ERROR");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Schedule email for future
    @PostMapping("/schedule")
    public ResponseEntity<Map<String, Object>> scheduleEmail(@Valid @RequestBody EmailScheduleRequest request) {
        try {
            EmailSchedule emailSchedule = new EmailSchedule(
                request.getRecipientEmail(),
                request.getSubject(),
                request.getBody(),
                request.getScheduledTime()
            );
            
            EmailSchedule savedSchedule = emailService.scheduleEmail(emailSchedule);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Email scheduled successfully!");
            response.put("status", "SUCCESS");
            response.put("scheduledId", savedSchedule.getId());
            response.put("scheduledTime", savedSchedule.getScheduledTime());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed to schedule email: " + e.getMessage());
            response.put("status", "ERROR");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get all scheduled emails
    @GetMapping("/scheduled")
    public ResponseEntity<List<EmailSchedule>> getScheduledEmails() {
        List<EmailSchedule> scheduledEmails = emailService.getScheduledEmails();
        return ResponseEntity.ok(scheduledEmails);
    }

    // Get pending emails
    @GetMapping("/pending")
    public ResponseEntity<List<EmailSchedule>> getPendingEmails() {
        List<EmailSchedule> pendingEmails = emailService.getPendingEmails();
        return ResponseEntity.ok(pendingEmails);
    }

    // Cancel scheduled email
    @DeleteMapping("/schedule/{id}")
    public ResponseEntity<Map<String, String>> cancelScheduledEmail(@PathVariable Long id) {
        boolean cancelled = emailService.cancelScheduledEmail(id);
        
        Map<String, String> response = new HashMap<>();
        if (cancelled) {
            response.put("message", "Scheduled email cancelled successfully!");
            response.put("status", "SUCCESS");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to cancel scheduled email. It may have already been sent or doesn't exist.");
            response.put("status", "ERROR");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ChronoMail");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}