package com.portfolio.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "portfolio"));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }

    public List<String> listImages() {
        try {
            Map<?, ?> result = cloudinary.api().resources(ObjectUtils.asMap(
                "type", "upload",
                "prefix", "portfolio/",
                "max_results", 500
            ));
            List<?> resources = (List<?>) result.get("resources");
            List<String> urls = new ArrayList<>();
            if (resources != null) {
                for (Object res : resources) {
                    if (res instanceof Map) {
                        Map<?, ?> map = (Map<?, ?>) res;
                        urls.add(map.get("secure_url").toString());
                    }
                }
            }
            return urls;
        } catch (Exception e) {
            throw new RuntimeException("Failed to list files from Cloudinary", e);
        }
    }
}
