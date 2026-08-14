package com.spatify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String serviceName;
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String text;

    private boolean responded = false;

    @Column(columnDefinition = "TEXT")
    private String response;

    @ElementCollection
    @CollectionTable(name = "review_comments", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "comment", columnDefinition = "TEXT")
    private List<String> comments = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(User user, String serviceName, int rating, String text) {
        this.user = user;
        this.serviceName = serviceName;
        this.rating = rating;
        this.text = text;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public boolean isResponded() { return responded; }
    public void setResponded(boolean responded) { this.responded = responded; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public List<String> getComments() { return comments; }
    public void setComments(List<String> comments) { this.comments = comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
