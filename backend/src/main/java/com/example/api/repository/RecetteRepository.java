package com.example.api.repository;

import com.example.api.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;



// Recette
public interface RecetteRepository extends JpaRepository<Recette, Long> {
  List<Recette> findByUtilisateur_Id(Long utilisateurId);
}