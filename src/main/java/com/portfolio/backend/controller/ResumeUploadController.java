package com.portfolio.backend.controller;

import com.portfolio.backend.model.Profile;
import com.portfolio.backend.service.ProfileService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeUploadController {

    private final ProfileService profileService;

    /**
     * Upload a resume file — bytes are stored directly in the MySQL database.
     * No Cloudinary, no filesystem. Works in any environment.
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "No file selected. Please choose a file to upload.");
            return ResponseEntity.badRequest().body(err);
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            originalName = "resume.pdf";
        }

        // Sanitise filename
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._\\-() ]", "_");
        String contentType = resolveContentType(safeName, file.getContentType());

        try {
            byte[] bytes = file.getBytes();

            Profile profile = profileService.getProfile().orElseGet(Profile::new);
            profile.setResumeFileName(safeName);
            profile.setResumeContentType(contentType);
            profile.setResumeData(bytes);
            // Mark that a resume exists (used by the index page visibility check)
            profile.setResumeUrl("/api/resume/download");
            profileService.saveProfile(profile);

            Map<String, String> response = new HashMap<>();
            response.put("url", "/api/resume/download");
            response.put("fileName", safeName);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    /**
     * Returns resume metadata (url + fileName). Used by the index page to
     * decide whether to show the Download Resume button.
     */
    @GetMapping
    public ResponseEntity<Map<String, String>> getResume() {
        return profileService.getProfile().map(profile -> {
            Map<String, String> res = new HashMap<>();
            boolean hasResume = profile.getResumeData() != null
                    && profile.getResumeData().length > 0;
            res.put("url",      hasResume ? "/api/resume/download" : "");
            res.put("fileName", profile.getResumeFileName() != null
                    ? profile.getResumeFileName() : "");
            return ResponseEntity.ok(res);
        }).orElse(ResponseEntity.ok(new HashMap<>()));
    }

    /**
     * Streams the stored resume bytes from the database to the browser.
     * Content-Disposition: attachment forces a file download.
     */
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadResume() {
        java.util.Optional<Profile> profileOpt = profileService.getProfile();

        if (profileOpt.isEmpty()
                || profileOpt.get().getResumeData() == null
                || profileOpt.get().getResumeData().length == 0) {
            return ResponseEntity.<byte[]>notFound().build();
        }

        Profile profile = profileOpt.get();
        String fileName = profile.getResumeFileName() != null
                ? profile.getResumeFileName() : "resume.pdf";
        String contentType = profile.getResumeContentType() != null
                ? profile.getResumeContentType()
                : resolveContentType(fileName, null);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .body(profile.getResumeData());
    }

    /**
     * Deletes resume data from the database and clears all resume fields.
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> removeResume() {
        profileService.getProfile().ifPresent(profile -> {
            profile.setResumeData(null);
            profile.setResumeFileName(null);
            profile.setResumeContentType(null);
            profile.setResumeUrl(null);
            profileService.saveProfile(profile);
        });
        Map<String, String> res = new HashMap<>();
        res.put("message", "Resume removed successfully.");
        return ResponseEntity.ok(res);
    }

    // ---------------------------------------------------------------
    private String resolveContentType(String fileName, String httpContentType) {
        // Prefer the extension-based type for accuracy
        String ext = fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
                : "";
        return switch (ext) {
            case "pdf"  -> "application/pdf";
            case "doc"  -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "csv"  -> "text/csv";
            case "txt"  -> "text/plain";
            default     -> httpContentType != null
                    ? httpContentType : "application/octet-stream";
        };
    }
}
