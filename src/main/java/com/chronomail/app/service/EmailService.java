package com.chronomail.app.service;

import com.chronomail.app.model.EmailSchedule;
import com.chronomail.app.model.ScheduleStatus;
import com.chronomail.app.repository.EmailScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private EmailScheduleRepository emailScheduleRepository;

    public void sendEmail(String to, String subject, String body) {
        if (to == null || to.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient email cannot be null or empty");
        }
        
        String safeSubject = (subject != null) ? subject : "No Subject";
        String safeBody = (body != null) ? body : "";
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(safeSubject);
        message.setText(safeBody);
        
        mailSender.send(message);
    }
    
    public EmailSchedule scheduleEmail(EmailSchedule emailSchedule) {
        return emailScheduleRepository.save(emailSchedule);
    }
    
    // This method runs every minute to check for pending emails
    @Scheduled(fixedRate = 60000) // Run every 60 seconds
    public void processScheduledEmails() {
        LocalDateTime now = LocalDateTime.now();
        List<EmailSchedule> pendingEmails = emailScheduleRepository.findPendingEmailsToSend(now);
        
        for (EmailSchedule emailSchedule : pendingEmails) {
            try {
                sendEmail(
                    emailSchedule.getRecipientEmail(),
                    emailSchedule.getSubject(),
                    emailSchedule.getBody()
                );
                
                emailSchedule.setStatus(ScheduleStatus.SENT);
                emailSchedule.setSentTime(LocalDateTime.now());
                emailScheduleRepository.save(emailSchedule);
                
                System.out.println("✅ Sent scheduled email to: " + emailSchedule.getRecipientEmail());
                
            } catch (Exception e) {
                emailSchedule.setRetryCount(emailSchedule.getRetryCount() + 1);
                if (emailSchedule.getRetryCount() >= 3) {
                    emailSchedule.setStatus(ScheduleStatus.FAILED);
                }
                emailScheduleRepository.save(emailSchedule);
                
                System.err.println("❌ Failed to send scheduled email: " + e.getMessage());
            }
        }
    }
    
    public List<EmailSchedule> getScheduledEmails() {
        return emailScheduleRepository.findAll();
    }
    
    public List<EmailSchedule> getPendingEmails() {
        return emailScheduleRepository.findByStatusOrderByScheduledTimeAsc(ScheduleStatus.PENDING);
    }
    
    public boolean cancelScheduledEmail(Long id) {
        return emailScheduleRepository.findById(id)
            .map(email -> {
                if (email.getStatus() == ScheduleStatus.PENDING) {
                    email.setStatus(ScheduleStatus.CANCELLED);
                    emailScheduleRepository.save(email);
                    return true;
                }
                return false;
            })
            .orElse(false);
    }
}