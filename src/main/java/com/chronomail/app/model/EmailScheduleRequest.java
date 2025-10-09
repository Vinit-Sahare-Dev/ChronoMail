package com.chronomail.app.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EmailScheduleRequest {
    
    @NotBlank(message = "Receiver's email is required")
    @Email(message = "Invalid email format")
    private String recipientEmail;
    
    private String subject;
    private String body;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledTime;

    // Constructors
    public EmailScheduleRequest() {}

    public EmailScheduleRequest(String recipientEmail, String subject, String body, LocalDateTime scheduledTime) {
        this.recipientEmail = recipientEmail;
        this.subject = subject;
        this.body = body;
        this.scheduledTime = scheduledTime;
    }

    // Getters and Setters
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
}