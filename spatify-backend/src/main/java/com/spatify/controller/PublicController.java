package com.spatify.controller;

import com.spatify.model.Review;
import com.spatify.model.SalonService;
import com.spatify.repository.ReviewRepository;
import com.spatify.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;
    private final com.spatify.repository.UserRepository userRepository;

    public PublicController(ServiceRepository serviceRepository, ReviewRepository reviewRepository, com.spatify.repository.UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/services")
    public ResponseEntity<List<SalonService>> getServices() {
        return ResponseEntity.ok(serviceRepository.findByActiveTrue());
    }

    @GetMapping("/staff")
    public ResponseEntity<?> getStaff() {
        List<com.spatify.model.User> staff = userRepository.findByRole(com.spatify.model.enums.Role.STAFF);
        List<Map<String, Object>> result = new ArrayList<>();
        for (com.spatify.model.User u : staff) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getFullName());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getReviews() {
        List<Review> reviews = reviewRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Review r : reviews) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("rating", r.getRating());
            map.put("text", r.getText());
            map.put("serviceName", r.getServiceName());
            map.put("responded", r.isResponded());
            map.put("response", r.getResponse());
            map.put("comments", r.getComments());
            map.put("createdAt", r.getCreatedAt().toString());
            map.put("userName", r.getUser().getFullName());
            map.put("userInitials", ("" + r.getUser().getFirstName().charAt(0) + r.getUser().getLastName().charAt(0)).toUpperCase());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
