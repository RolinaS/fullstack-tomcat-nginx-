package com.example.api.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record AlimentCreateDTO(
  @NotBlank @Size(max = 100) String nom,
  @PositiveOrZero BigDecimal proteine,
  @PositiveOrZero BigDecimal lipide,
  @PositiveOrZero BigDecimal glucide,
  @PositiveOrZero BigDecimal matiereGrasse,
  @PositiveOrZero Integer kilocalorie,
  Long familleId
) {}
