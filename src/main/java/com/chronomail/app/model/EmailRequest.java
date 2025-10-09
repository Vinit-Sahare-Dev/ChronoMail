package com.chronomail.app.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EmailRequest {
    
    @NotBlank(message = "Receiver's email is required")
    @Email(message = "Invalid email format")
    private String receiversMail;
    
    private String subject;
    private String body;

    public EmailRequest() {}

    public EmailRequest(String receiversMail, String subject, String body) {
        this.receiversMail = receiversMail;
        this.subject = subject;
        this.body = body;
    }

    public String getReceiversMail() {
        return receiversMail;
    }

    public void setReceiversMail(String receiversMail) {
        this.receiversMail = receiversMail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
    
    @Override
    public String toString() {
        return "EmailRequest{" +
                "receiversMail='" + receiversMail + '\'' +
                ", subject='" + subject + '\'' +
                ", body='" + body + '\'' +
                '}';
    }
}