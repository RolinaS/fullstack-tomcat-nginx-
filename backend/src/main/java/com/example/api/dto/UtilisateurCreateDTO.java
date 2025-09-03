package com.example.api.dto;

import jakarta.validation.constraints.*;

public record UtilisateurCreateDTO(
  @NotBlank @Size(max = 50) String prenom,
  @NotBlank @Size(max = 50) String nom,
  @NotBlank @Email @Size(max = 100) String email,
  @NotBlank @Size(min = 8) String motDePasse, 
  @NotBlank @Pattern(regexp = "Homme|Femme|Autre") String genre,
  @Positive Integer taille,
  @Positive java.math.BigDecimal poids
) {}
