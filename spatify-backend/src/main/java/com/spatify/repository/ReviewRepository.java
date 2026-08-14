package com.spatify.repository;

import com.spatify.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByRating(int rating);
    List<Review> findByRespondedFalse();

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();
}
