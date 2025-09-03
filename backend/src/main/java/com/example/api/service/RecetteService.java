package com.example.api.service;

import com.example.api.domain.*;
import com.example.api.dto.*;
import com.example.api.error.NotFoundException;
import com.example.api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class RecetteService {
  private final RecetteRepository repo;
  private final UtilisateurRepository utilisateurRepo;

  public RecetteService(RecetteRepository repo, UtilisateurRepository utilisateurRepo) {
    this.repo = repo; this.utilisateurRepo = utilisateurRepo;
  }

  public RecetteDTO create(RecetteCreateDTO in){
    var r = new Recette();
    r.setNom(in.nom());

    if (in.utilisateurId()!=null) {
      var u = utilisateurRepo.findById(in.utilisateurId())
        .orElseThrow(() -> new NotFoundException("Utilisateur "+in.utilisateurId()+" introuvable"));
      r.setUtilisateur(u);
    }

    if (in.typeRepasId()!=null) {
      var repas = new Repas(); repas.setId(in.typeRepasId()); // attach by id
      r.setTypeRepas(repas);
    } else {
      r.setTypeRepas(null);
    }

    return toDTO(repo.save(r));
  }

  @Transactional(readOnly = true)
  public org.springframework.data.domain.Page<RecetteDTO> list(org.springframework.data.domain.Pageable pageable){
    return repo.findAll(pageable).map(this::toDTO);
  }

  @Transactional(readOnly = true)
  public Recette getEntity(Long id){
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Recette "+id+" introuvable"));
  }

  @Transactional(readOnly = true)
  public RecetteDTO get(Long id){ return toDTO(getEntity(id)); }

  public RecetteDTO update(Long id, RecetteCreateDTO in){
    var r = getEntity(id);
    r.setNom(in.nom());

    if (in.utilisateurId()!=null) {
      var u = utilisateurRepo.findById(in.utilisateurId())
        .orElseThrow(() -> new NotFoundException("Utilisateur "+in.utilisateurId()+" introuvable"));
      r.setUtilisateur(u);
    } else r.setUtilisateur(null);

    if (in.typeRepasId()!=null) {
      var repas = new Repas(); repas.setId(in.typeRepasId());
      r.setTypeRepas(repas);
    } else r.setTypeRepas(null);

    return toDTO(r);
  }

  public void delete(Long id){ repo.delete(getEntity(id)); }

  private RecetteDTO toDTO(Recette r){
    Long uId = r.getUtilisateur()!=null ? r.getUtilisateur().getId() : null;
    String uNom = r.getUtilisateur()!=null ? (r.getUtilisateur().getPrenom()+" "+r.getUtilisateur().getNom()) : null;
    Long repasId = r.getTypeRepas()!=null ? r.getTypeRepas().getId() : null;
    String repasNom = r.getTypeRepas()!=null ? r.getTypeRepas().getNom() : null;
    return new RecetteDTO(r.getId(), r.getNom(), uId, uNom, repasId, repasNom);
  }
}
