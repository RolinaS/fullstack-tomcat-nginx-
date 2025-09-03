package com.example.api.service;

import com.example.api.domain.Utilisateur;
import com.example.api.dto.*;
import com.example.api.error.NotFoundException;
import com.example.api.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class UtilisateurService {
  private final UtilisateurRepository repo;
  public UtilisateurService(UtilisateurRepository repo){ this.repo = repo; }

  public UtilisateurDTO create(UtilisateurCreateDTO in){
    if (repo.existsByEmail(in.email())) throw new IllegalArgumentException("Email déjà utilisé");
    var u = new Utilisateur();
    u.setPrenom(in.prenom()); u.setNom(in.nom());
    u.setEmail(in.email());
    u.setMotDePasse(in.motDePasse());
    u.setGenre(in.genre()); u.setTaille(in.taille()); u.setPoids(in.poids());
    var saved = repo.save(u);
    return toDTO(saved);
  }

  @Transactional(readOnly = true)
  public org.springframework.data.domain.Page<UtilisateurDTO> list(org.springframework.data.domain.Pageable pageable){
    return repo.findAll(pageable).map(this::toDTO);
  }

  @Transactional(readOnly = true)
  public Utilisateur getEntity(Long id){
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Utilisateur "+id+" introuvable"));
  }

  @Transactional(readOnly = true)
  public UtilisateurDTO get(Long id){ return toDTO(getEntity(id)); }

  public UtilisateurDTO update(Long id, UtilisateurCreateDTO in){
    var u = getEntity(id);
    u.setPrenom(in.prenom()); u.setNom(in.nom());
    u.setEmail(in.email());
    u.setMotDePasse(in.motDePasse());
    u.setGenre(in.genre()); u.setTaille(in.taille()); u.setPoids(in.poids());
    return toDTO(u);
  }

  public void delete(Long id){ repo.delete(getEntity(id)); }

  private UtilisateurDTO toDTO(Utilisateur u){
    return new UtilisateurDTO(u.getId(), u.getPrenom(), u.getNom(), u.getEmail(), u.getGenre(), u.getTaille(), u.getPoids());
  }
}
