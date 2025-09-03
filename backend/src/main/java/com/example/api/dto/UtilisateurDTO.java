package com.example.api.dto;

public record UtilisateurDTO(
  Long id, String prenom, String nom, String email, String genre, Integer taille, java.math.BigDecimal poids
) {}
