package com.example.api.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "recette_aliment")
public class RecetteAliment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "recette_id", nullable = false,
      foreignKey = @ForeignKey(name = "recette_aliment_recette_id_fkey"))
  private Recette recette;

  @ManyToOne(optional = false)
  @JoinColumn(name = "aliment_id", nullable = false,
      foreignKey = @ForeignKey(name = "recette_aliment_aliment_id_fkey"))
  private Aliment aliment;

  @Column(nullable = false, precision = 6, scale = 2)
  private BigDecimal poids;

  public RecetteAliment() {}

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Recette getRecette() { return recette; }
  public void setRecette(Recette recette) { this.recette = recette; }
  public Aliment getAliment() { return aliment; }
  public void setAliment(Aliment aliment) { this.aliment = aliment; }
  public BigDecimal getPoids() { return poids; }
  public void setPoids(BigDecimal poids) { this.poids = poids; }
}
