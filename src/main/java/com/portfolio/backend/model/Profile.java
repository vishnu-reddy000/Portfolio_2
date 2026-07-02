package com.portfolio.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String title;

    @Column(length = 500, nullable = false)
    private String subtitle;

    @Column(length = 2000, nullable = false)
    private String bio;

    private String experienceYears; 

    private String projectsCount; 

    private String academicStanding; 

    @Column(length = 2000)
    private String avatarUrl;

    private String githubUrl;

    private String linkedinUrl;

    private String naukriUrl;

    private String email;

    private String phone;

    private String location;
}
