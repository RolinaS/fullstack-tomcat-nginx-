package com.example.api.dto;

import java.math.BigDecimal;

public record RecetteAlimentDTO(
  Long id, Long recetteId, String recetteNom, Long alimentId, String alimentNom, BigDecimal poids
) {}
