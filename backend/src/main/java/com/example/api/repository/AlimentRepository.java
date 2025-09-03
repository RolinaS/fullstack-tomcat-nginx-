package com.example.api.repository;

import com.example.api.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

// Aliment
public interface AlimentRepository extends JpaRepository<Aliment, Long> {}
