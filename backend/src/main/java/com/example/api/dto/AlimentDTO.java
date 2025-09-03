package com.example.api.dto;

import java.math.BigDecimal;

public record AlimentDTO(
  Long id, String nom, BigDecimal proteine, BigDecimal lipide, BigDecimal glucide,
  BigDecimal matiereGrasse, Integer kilocalorie, Long familleId, String familleNom
) {}
