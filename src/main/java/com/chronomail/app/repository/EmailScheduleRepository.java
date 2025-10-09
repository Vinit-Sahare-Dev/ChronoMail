package com.chronomail.app.repository;

import com.chronomail.app.model.EmailSchedule;
import com.chronomail.app.model.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmailScheduleRepository extends JpaRepository<EmailSchedule, Long> {
    
    List<EmailSchedule> findByStatusOrderByScheduledTimeAsc(ScheduleStatus status);
    
    List<EmailSchedule> findByRecipientEmailOrderByScheduledTimeDesc(String recipientEmail);
    
    @Query("SELECT e FROM EmailSchedule e WHERE e.status = 'PENDING' AND e.scheduledTime <= :now")
    List<EmailSchedule> findPendingEmailsToSend(LocalDateTime now);
    
    long countByStatus(ScheduleStatus status);
}