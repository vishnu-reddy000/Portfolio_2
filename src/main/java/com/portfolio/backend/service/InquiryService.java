package com.portfolio.backend.service;

import com.portfolio.backend.model.Inquiry;
import com.portfolio.backend.repository.InquiryRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    public Inquiry saveInquiry(Inquiry inquiry) {
        Inquiry saved = inquiryRepository.save(inquiry);
        
        // Trigger asynchronous Web3Forms notification submission
        CompletableFuture.runAsync(() -> sendWeb3FormsNotification(saved));
        
        return saved;
    }

    private void sendWeb3FormsNotification(Inquiry inquiry) {
        try {
            String jsonPayload = String.format(
                    "{\"access_key\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"message\":\"%s\",\"subject\":\"%s\"}",
                    "fddb70b8-f73f-46d6-8da9-db2c070000ba",
                    escapeJson(inquiry.getName()),
                    escapeJson(inquiry.getEmail()),
                    escapeJson(inquiry.getMessage()),
                    escapeJson("New Portfolio Inquiry from " + inquiry.getName())
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.web3forms.com/submit"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            log.info("Sending Web3Forms notification for inquiry from: {}", inquiry.getEmail());
            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() >= 200 && response.statusCode() < 300) {
                            log.info("Web3Forms notification sent successfully. Status: {}", response.statusCode());
                        } else {
                            log.warn("Failed to send Web3Forms notification. Status: {}, Body: {}", 
                                    response.statusCode(), response.body());
                        }
                    })
                    .exceptionally(ex -> {
                        log.error("Error sending Web3Forms notification", ex);
                        return null;
                    });
        } catch (Exception e) {
            log.error("Failed to build Web3Forms request", e);
        }
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }

    public void deleteInquiry(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + id));
        inquiryRepository.delete(inquiry);
    }
}
