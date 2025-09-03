package com.example.api.repository;

import com.example.api.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// RecetteAliment
public interface RecetteAlimentRepository extends JpaRepository<RecetteAliment, Long> {
  List<RecetteAliment> findByRecette_Id(Long recetteId);
}