package com.spatify.controller;

import com.spatify.model.Review;
import com.spatify.model.User;
import com.spatify.repository.ReviewRepository;
import com.spatify.repository.UserRepository;
import com.spatify.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public ReviewController(ReviewRepository reviewRepository, UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, Object> body) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Review review = new Review();
        review.setUser(user);
        review.setServiceName((String) body.get("serviceName"));
        review.setRating((Integer) body.get("rating"));
        review.setText((String) body.get("text"));
        
        reviewRepository.save(review);

        return ResponseEntity.ok(Map.of("message", "Review submitted successfully!", "review", review));
    }
}
