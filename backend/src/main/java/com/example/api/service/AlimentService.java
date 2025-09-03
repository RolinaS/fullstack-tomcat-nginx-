package com.example.api.service;

import com.example.api.domain.*;
import com.example.api.dto.*;
import com.example.api.error.NotFoundException;
import com.example.api.repository.AlimentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class AlimentService {
  private final AlimentRepository repo;

  public AlimentService(AlimentRepository repo) {
    this.repo = repo;
  }

  public AlimentDTO create(AlimentCreateDTO in){
    var a = new Aliment();
    a.setNom(in.nom());
    a.setProteine(in.proteine()); a.setLipide(in.lipide());
    a.setGlucide(in.glucide()); a.setMatiereGrasse(in.matiereGrasse());
    a.setKilocalorie(in.kilocalorie());

    if (in.familleId()!=null){
      var f = new Famille(); f.setId(in.familleId()); // attach by id (sans vérif)
      a.setFamille(f);
    }

    return toDTO(repo.save(a));
  }

  @Transactional(readOnly = true)
  public org.springframework.data.domain.Page<AlimentDTO> list(org.springframework.data.domain.Pageable pageable){
    return repo.findAll(pageable).map(this::toDTO);
  }

  @Transactional(readOnly = true)
  public Aliment getEntity(Long id){
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Aliment "+id+" introuvable"));
  }

  @Transactional(readOnly = true)
  public AlimentDTO get(Long id){ return toDTO(getEntity(id)); }

  public AlimentDTO update(Long id, AlimentCreateDTO in){
    var a = getEntity(id);
    a.setNom(in.nom());
    a.setProteine(in.proteine()); a.setLipide(in.lipide());
    a.setGlucide(in.glucide()); a.setMatiereGrasse(in.matiereGrasse());
    a.setKilocalorie(in.kilocalorie());

    if (in.familleId()!=null){ var f = new Famille(); f.setId(in.familleId()); a.setFamille(f); }
    else a.setFamille(null);

    return toDTO(a);
  }

  public void delete(Long id){ repo.delete(getEntity(id)); }

  private AlimentDTO toDTO(Aliment a){
    var famId = a.getFamille()!=null ? a.getFamille().getId() : null;
    var famNom = a.getFamille()!=null ? a.getFamille().getNom() : null;
    return new AlimentDTO(a.getId(), a.getNom(), a.getProteine(), a.getLipide(), a.getGlucide(),
      a.getMatiereGrasse(), a.getKilocalorie(), famId, famNom);
  }
}
