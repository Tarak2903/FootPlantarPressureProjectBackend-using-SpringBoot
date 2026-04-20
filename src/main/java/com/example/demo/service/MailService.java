package com.example.demo.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String fromOverride;

    @Value("${spring.mail.username:}")
    private String configuredUsername;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPdfReport(String toEmail, String patientName, byte[] pdfBytes, String filename)
            throws jakarta.mail.MessagingException {
        String from = fromOverride != null && !fromOverride.isBlank()
                ? fromOverride
                : configuredUsername;
        if (from == null || from.isBlank()) {
            throw new IllegalStateException("Configure app.mail.from or spring.mail.username to send email.");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(from);
        helper.setTo(toEmail);
        helper.setSubject("Your plantar pressure analysis report");
        String safeName = patientName != null && !patientName.isBlank() ? patientName : "Patient";
        helper.setText("Dear " + safeName + ",\n\nPlease find attached your plantar pressure analysis report.\n\nRegards");
        String attachName = (filename != null && !filename.isBlank()) ? filename : "plantar-pressure-report.pdf";
        helper.addAttachment(attachName, new ByteArrayResource(pdfBytes));
        mailSender.send(message);
    }
}
