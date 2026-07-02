package com.portfolio.backend.controller;

import com.portfolio.backend.service.CloudinaryService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Please select a file to upload");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {
            String imageUrl = cloudinaryService.uploadFile(file);
            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("url", imageUrl);
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/images")
    public ResponseEntity<List<String>> getCloudinaryImages() {
        try {
            return ResponseEntity.ok(cloudinaryService.listImages());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
