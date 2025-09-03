package com.example.api.dto;

import jakarta.validation.constraints.*;

public record RecetteCreateDTO(
  @NotBlank @Size(max = 100) String nom,
  Long utilisateurId,   // nullable
  Long typeRepasId      // nullable
) {}
