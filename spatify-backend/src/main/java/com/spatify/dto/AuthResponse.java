package com.spatify.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String role;
    private String phone;
    private Long userId;

    public AuthResponse(String token, String email, String name, String role, String phone, Long userId) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.phone = phone;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getPhone() { return phone; }
    public Long getUserId() { return userId; }
}
