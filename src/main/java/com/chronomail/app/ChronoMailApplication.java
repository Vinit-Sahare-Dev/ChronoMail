package com.chronomail.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Add this annotation
public class ChronoMailApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChronoMailApplication.class, args);
        System.out.println("🚀 ChronoMail Application Started Successfully!");
        System.out.println("📧 Email Scheduler is active and running...");
    }
}