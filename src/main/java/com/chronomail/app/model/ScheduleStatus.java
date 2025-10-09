package com.chronomail.app.model;

public enum ScheduleStatus {
    PENDING,      // Email is scheduled and waiting to be sent
    SENT,         // Email has been successfully sent
    FAILED,       // Email sending failed after retries
    CANCELLED     // Email was cancelled by user
}