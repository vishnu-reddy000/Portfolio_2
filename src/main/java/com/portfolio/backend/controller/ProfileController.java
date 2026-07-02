package com.portfolio.backend.controller;

import com.portfolio.backend.config.PortfolioWebSocketHandler;
import com.portfolio.backend.model.Profile;
import com.portfolio.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final PortfolioWebSocketHandler webSocketHandler;

    @GetMapping
    public ResponseEntity<Profile> getProfile() {
        return profileService.getProfile()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profileDetails) {
        Profile updated = profileService.updateProfile(profileDetails);
        webSocketHandler.broadcastUpdate("profile_update");
        return ResponseEntity.ok(updated);
    }
}
