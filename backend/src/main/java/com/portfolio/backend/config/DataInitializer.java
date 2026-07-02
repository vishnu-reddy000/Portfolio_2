package com.portfolio.backend.config;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.Skill;
import com.portfolio.backend.model.Profile;
import com.portfolio.backend.model.Experience;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.repository.SkillRepository;
import com.portfolio.backend.repository.ProfileRepository;
import com.portfolio.backend.repository.ExperienceRepository;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ProfileRepository profileRepository;
    private final ExperienceRepository experienceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (profileRepository.count() == 0) {
            log.info("Seeding initial profile data...");
            Profile profile = Profile.builder()
                    .name("M. Vishnu Vardhan Reddy")
                    .title("Crafting Scalable Backends & Premium UIs")
                    .subtitle("I am M. Vishnu Vardhan Reddy, an Associate Software Engineer & Full Stack Developer. I build enterprise-grade Java applications using Spring Boot, design scalable REST APIs, and create premium user experiences.")
                    .bio("Results-driven Java Full Stack Developer with hands-on professional experience in building enterprise-grade web applications using Java, Spring Boot, REST APIs, and MySQL. Holds a B.Tech in Electrical and Electronics Engineering complemented by recognized industry certifications and real-world project delivery. Passionate about clean architecture, scalable systems, and continuous improvement.")
                    .experienceYears("2024")
                    .projectsCount("5+")
                    .academicStanding("7.66 CGPA")
                    .avatarUrl("https://res.cloudinary.com/dp08coqkk/image/upload/v1781195187/WhatsApp_Image_2026-06-06_at_9.25.24_PM_nslt0s.jpg")
                    .githubUrl("https://github.com")
                    .linkedinUrl("https://linkedin.com/in/vishnu-reddy-ab269b333/")
                    .naukriUrl("https://naukri.com")
                    .email("vishnumatamala10@gmail.com")
                    .phone("+91 8074407095")
                    .location("Andhra Pradesh, India")
                    .build();
            profileRepository.save(profile);
            log.info("Profile data seeded successfully.");
        }

        if (experienceRepository.count() == 0) {
            log.info("Seeding initial experience timeline data...");
            Experience e1 = Experience.builder()
                    .role("Associate Software Engineer")
                    .duration("Apr 2025 – Present")
                    .description("Speshway Solutions Pvt. Ltd. | Hyderabad, India. Developed and maintained enterprise-level Java Full Stack applications using Java, Spring Boot, JavaScript, HTML, CSS, REST APIs, and MySQL. Contributed to a Smart Office Management System and Multi-Tenant SaaS CRM platform. Worked with Jenkins CI/CD and Git/GitHub.")
                    .displayOrder(1)
                    .build();

            Experience e2 = Experience.builder()
                    .role("B.Tech – Electrical and Electronics Engineering (EEE)")
                    .duration("2020 – 2024")
                    .description("Sreenivasa Institute of Technology & Management Studies, JNTU-A | CGPA: 7.66. Main project: Design of 175kW Grid-Connected Photovoltaic System using MATLAB/Simulink.")
                    .displayOrder(2)
                    .build();

            Experience e3 = Experience.builder()
                    .role("Intermediate (MPC)")
                    .duration("2020")
                    .description("Sri Chaitanya Junior College, Andhra Pradesh | CGPA: 8.73.")
                    .displayOrder(3)
                    .build();

            Experience e4 = Experience.builder()
                    .role("Class X (SSC)")
                    .duration("2018")
                    .description("Camford English Medium School | GPA: 8.7.")
                    .displayOrder(4)
                    .build();

            experienceRepository.saveAll(Arrays.asList(e1, e2, e3, e4));
            log.info("Experience data seeded successfully.");
        }

        boolean hasGenericProjects = projectRepository.findAll().stream()
                .anyMatch(p -> p.getTitle().equals("E-Commerce Platform") || p.getTitle().equals("Personal Portfolio Website"));
        boolean hasPlaceholderImages = projectRepository.findAll().stream()
                .anyMatch(p -> p.getImageUrl().contains("photo-1556742049-0cfed4f6a45d") 
                        || p.getImageUrl().contains("photo-1497366216548-37526070297c")
                        || p.getImageUrl().contains("photo-1509391366360-2e959784a276"));

        if (projectRepository.count() < 4 || hasGenericProjects || hasPlaceholderImages) {
            log.info("Seeding initial projects data...");
            projectRepository.deleteAll();

            Project p1 = Project.builder()
                    .title("Multi-Tenant SaaS CRM Platform")
                    .description("Developed a scalable CRM platform supporting multiple tenants with role-based access control and tenant-specific configurations. Implemented RESTful APIs for frontend-backend communication, optimized database queries for performance, and contributed to CI/CD deployment workflows using Jenkins.")
                    .imageUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80")
                    .technologies("Java, Spring Boot, REST APIs, MySQL, HTML, CSS, JavaScript")
                    .githubLink("https://github.com")
                    .liveLink("")
                    .displayOrder(1)
                    .build();

            Project p2 = Project.builder()
                    .title("Smart Office Management System")
                    .description("Built a full-stack enterprise office management application featuring employee attendance tracking, leave management, task assignment, and department-wise reporting. Deployed on Apache Tomcat with a responsive UI and persistent MySQL storage.")
                    .imageUrl("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80")
                    .technologies("Java, Spring Boot, Servlets, JDBC, MySQL, HTML5, CSS3")
                    .githubLink("https://github.com")
                    .liveLink("")
                    .displayOrder(2)
                    .build();

            Project p3 = Project.builder()
                    .title("Design of 175kW Grid-Connected Photovoltaic System")
                    .description("Final year B.Tech project developing an accurate simulation model for a 175kW solar PV system, including performance analysis, grid integration, and energy output optimization.")
                    .imageUrl("https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80")
                    .technologies("MATLAB/Simulink, Solar PV Simulation")
                    .githubLink("")
                    .liveLink("")
                    .displayOrder(3)
                    .build();

            Project p4 = Project.builder()
                    .title("Substation Industrial Training & Report")
                    .description("Visited a local substation with a team of six, studied electrical operations, safety protocols, and equipment, and compiled a comprehensive technical report.")
                    .imageUrl("https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80")
                    .technologies("Electrical Engineering, Technical Reporting")
                    .githubLink("")
                    .liveLink("")
                    .displayOrder(4)
                    .build();

            projectRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
            log.info("Projects data seeded successfully.");
        }

        if (skillRepository.count() == 0) {
            log.info("Seeding initial skills data...");
            // Backend Skills
            Skill s1 = Skill.builder().name("Java").category("Languages").proficiency("Expert").displayOrder(1).build();
            Skill s2 = Skill.builder().name("Spring Boot").category("Backend").proficiency("Expert").displayOrder(2).build();
            Skill s3 = Skill.builder().name("Python").category("Languages").proficiency("Intermediate").displayOrder(3).build();

            // Frontend Skills
            Skill s4 = Skill.builder().name("JavaScript/TypeScript").category("Languages").proficiency("Expert").displayOrder(4).build();
            Skill s5 = Skill.builder().name("React").category("Frontend").proficiency("Expert").displayOrder(5).build();
            Skill s6 = Skill.builder().name("CSS/HTML").category("Frontend").proficiency("Advanced").displayOrder(6).build();

            // Database Skills
            Skill s7 = Skill.builder().name("PostgreSQL").category("Database").proficiency("Advanced").displayOrder(7).build();
            Skill s8 = Skill.builder().name("MySQL").category("Database").proficiency("Advanced").displayOrder(8).build();
            Skill s9 = Skill.builder().name("Redis").category("Database").proficiency("Intermediate").displayOrder(9).build();

            // DevOps & Tools
            Skill s10 = Skill.builder().name("Docker").category("DevOps").proficiency("Advanced").displayOrder(10).build();
            Skill s11 = Skill.builder().name("Git").category("Tools").proficiency("Expert").displayOrder(11).build();
            Skill s12 = Skill.builder().name("AWS").category("DevOps").proficiency("Intermediate").displayOrder(12).build();

            skillRepository.saveAll(Arrays.asList(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12));
            log.info("Skills data seeded successfully.");
        }
    }
}
