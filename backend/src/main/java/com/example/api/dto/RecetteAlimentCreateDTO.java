package com.example.api.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record RecetteAlimentCreateDTO(
  @NotNull Long recetteId,
  @NotNull Long alimentId,
  @NotNull @Positive BigDecimal poids
) {}
