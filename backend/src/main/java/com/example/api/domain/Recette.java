package com.example.api.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "recette")
public class Recette {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = true)
  @JoinColumn(name = "utilisateur_id", foreignKey = @ForeignKey(name = "recette_utilisateur_id_fkey"))
  private Utilisateur utilisateur;

  @Column(nullable = false, length = 100)
  private String nom;

  @ManyToOne
  @JoinColumn(name = "type_repas_id", foreignKey = @ForeignKey(name = "recette_type_repas_id_fkey"))
  private Repas typeRepas;

  public Recette() {}

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Utilisateur getUtilisateur() { return utilisateur; }
  public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }
  public Repas getTypeRepas() { return typeRepas; }
  public void setTypeRepas(Repas typeRepas) { this.typeRepas = typeRepas; }
}
