package com.example.api.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "repas")
public class Repas {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 50)
  private String nom;

  public Repas() {}

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }
}
