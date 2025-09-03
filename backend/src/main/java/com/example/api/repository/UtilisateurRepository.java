package com.example.api.repository;

import com.example.api.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

// Utilisateur
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
  boolean existsByEmail(String email);
}