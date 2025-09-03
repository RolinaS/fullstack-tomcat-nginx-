package com.example.api.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50)
  private String prenom;

  @Column(nullable = false, length = 50)
  private String nom;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @Column(name = "mot_de_passe", nullable = false, columnDefinition = "text")
  private String motDePasse;

  @Column(nullable = false, length = 10)
  private String genre; // Homme|Femme|Autre

  @Column
  private Integer taille;

  @Column
  private BigDecimal poids;

  public Utilisateur() {}

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getPrenom() { return prenom; }
  public void setPrenom(String prenom) { this.prenom = prenom; }
  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getMotDePasse() { return motDePasse; }
  public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
  public String getGenre() { return genre; }
  public void setGenre(String genre) { this.genre = genre; }
  public Integer getTaille() { return taille; }
  public void setTaille(Integer taille) { this.taille = taille; }
  public BigDecimal getPoids() { return poids; }
  public void setPoids(BigDecimal poids) { this.poids = poids; }
}
