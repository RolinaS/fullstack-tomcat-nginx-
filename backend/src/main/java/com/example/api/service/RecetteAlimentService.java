package com.example.api.service;

import com.example.api.domain.*;
import com.example.api.dto.*;
import com.example.api.error.NotFoundException;
import com.example.api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class RecetteAlimentService {
  private final RecetteAlimentRepository repo;
  private final RecetteRepository recetteRepo;
  private final AlimentRepository alimentRepo;

  public RecetteAlimentService(RecetteAlimentRepository repo, RecetteRepository recetteRepo, AlimentRepository alimentRepo) {
    this.repo = repo; this.recetteRepo = recetteRepo; this.alimentRepo = alimentRepo;
  }

  public RecetteAlimentDTO create(RecetteAlimentCreateDTO in){
    var r = recetteRepo.findById(in.recetteId())
      .orElseThrow(() -> new NotFoundException("Recette "+in.recetteId()+" introuvable"));
    var a = alimentRepo.findById(in.alimentId())
      .orElseThrow(() -> new NotFoundException("Aliment "+in.alimentId()+" introuvable"));

    var ra = new RecetteAliment();
    ra.setRecette(r); ra.setAliment(a); ra.setPoids(in.poids());
    return toDTO(repo.save(ra));
  }

  @Transactional(readOnly = true)
  public java.util.List<RecetteAlimentDTO> listByRecette(Long recetteId){
    return repo.findByRecette_Id(recetteId).stream().map(this::toDTO).toList();
  }

  @Transactional(readOnly = true)
  public RecetteAlimentDTO get(Long id){
    return repo.findById(id).map(this::toDTO)
      .orElseThrow(() -> new NotFoundException("RecetteAliment "+id+" introuvable"));
  }

  public RecetteAlimentDTO update(Long id, RecetteAlimentCreateDTO in){
    var ra = repo.findById(id).orElseThrow(() -> new NotFoundException("RecetteAliment "+id+" introuvable"));
    var r = recetteRepo.findById(in.recetteId())
      .orElseThrow(() -> new NotFoundException("Recette "+in.recetteId()+" introuvable"));
    var a = alimentRepo.findById(in.alimentId())
      .orElseThrow(() -> new NotFoundException("Aliment "+in.alimentId()+" introuvable"));
    ra.setRecette(r); ra.setAliment(a); ra.setPoids(in.poids());
    return toDTO(ra);
  }

  public void delete(Long id){ repo.deleteById(id); }

  private RecetteAlimentDTO toDTO(RecetteAliment ra){
    return new RecetteAlimentDTO(
      ra.getId(),
      ra.getRecette().getId(),
      ra.getRecette().getNom(),
      ra.getAliment().getId(),
      ra.getAliment().getNom(),
      ra.getPoids()
    );
  }
}
