package com.portfolio.backend.service;

import com.portfolio.backend.model.Profile;
import com.portfolio.backend.repository.ProfileRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Optional<Profile> getProfile() {
        return profileRepository.findAll().stream().findFirst();
    }

    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public Profile updateProfile(Profile profileDetails) {
        Profile profile = getProfile()
                .orElseGet(() -> Profile.builder().build());

        profile.setName(profileDetails.getName());
        profile.setTitle(profileDetails.getTitle());
        profile.setSubtitle(profileDetails.getSubtitle());
        profile.setBio(profileDetails.getBio());
        profile.setExperienceYears(profileDetails.getExperienceYears());
        profile.setProjectsCount(profileDetails.getProjectsCount());
        profile.setAcademicStanding(profileDetails.getAcademicStanding());
        profile.setAvatarUrl(profileDetails.getAvatarUrl());
        profile.setGithubUrl(profileDetails.getGithubUrl());
        profile.setLinkedinUrl(profileDetails.getLinkedinUrl());
        profile.setNaukriUrl(profileDetails.getNaukriUrl());
        profile.setEmail(profileDetails.getEmail());
        profile.setPhone(profileDetails.getPhone());
        profile.setLocation(profileDetails.getLocation());

        return profileRepository.save(profile);
    }
}
