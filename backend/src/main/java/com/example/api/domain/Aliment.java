package com.example.api.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "aliment")
public class Aliment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 100)
  private String nom;

  @Column
  private BigDecimal proteine;

  @Column
  private BigDecimal lipide;

  @Column
  private BigDecimal glucide;

  @Column(name = "matiere_grasse")
  private BigDecimal matiereGrasse;

  @Column
  private Integer kilocalorie;

  @ManyToOne
  @JoinColumn(name = "famille_id", foreignKey = @ForeignKey(name = "aliment_famille_id_fkey"))
  private Famille famille;

  public Aliment() {}

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }
  public BigDecimal getProteine() { return proteine; }
  public void setProteine(BigDecimal proteine) { this.proteine = proteine; }
  public BigDecimal getLipide() { return lipide; }
  public void setLipide(BigDecimal lipide) { this.lipide = lipide; }
  public BigDecimal getGlucide() { return glucide; }
  public void setGlucide(BigDecimal glucide) { this.glucide = glucide; }
  public BigDecimal getMatiereGrasse() { return matiereGrasse; }
  public void setMatiereGrasse(BigDecimal matiereGrasse) { this.matiereGrasse = matiereGrasse; }
  public Integer getKilocalorie() { return kilocalorie; }
  public void setKilocalorie(Integer kilocalorie) { this.kilocalorie = kilocalorie; }
  public Famille getFamille() { return famille; }
  public void setFamille(Famille famille) { this.famille = famille; }
}
