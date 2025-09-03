package com.example.api.web;

import com.example.api.dto.*;
import com.example.api.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {
  private final UtilisateurService service;
  public UtilisateurController(UtilisateurService service){ this.service = service; }

  @PostMapping
  public ResponseEntity<UtilisateurDTO> create(@Valid @RequestBody UtilisateurCreateDTO in){
    var dto = service.create(in);
    return ResponseEntity.status(HttpStatus.CREATED).body(dto);
  }

  @GetMapping
  public Page<UtilisateurDTO> list(@RequestParam(defaultValue="0") int page,
                                   @RequestParam(defaultValue="20") int size){
    return service.list(PageRequest.of(page, size, Sort.by("id").descending()));
  }

  @GetMapping("/{id}") public UtilisateurDTO get(@PathVariable Long id){ return service.get(id); }

  @PutMapping("/{id}") public UtilisateurDTO update(@PathVariable Long id, @Valid @RequestBody UtilisateurCreateDTO in){
    return service.update(id, in);
  }

  @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id){ service.delete(id); }
}
