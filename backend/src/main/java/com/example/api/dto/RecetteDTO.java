package com.example.api.dto;

public record RecetteDTO(
  Long id, String nom, Long utilisateurId, String utilisateurNomComplet, Long typeRepasId, String typeRepasNom
) {}
