package com.example.api.web;

import com.example.api.dto.*;
import com.example.api.service.RecetteAlimentService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recette-aliments")
public class RecetteAlimentController {
  private final RecetteAlimentService service;
  public RecetteAlimentController(RecetteAlimentService service){ this.service = service; }

  @PostMapping
  public ResponseEntity<RecetteAlimentDTO> create(@Valid @RequestBody RecetteAlimentCreateDTO in){
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(in));
  }

  @GetMapping("/{id}") public RecetteAlimentDTO get(@PathVariable Long id){ return service.get(id); }

  @GetMapping(params = "recetteId")
  public List<RecetteAlimentDTO> listByRecette(@RequestParam Long recetteId){
    return service.listByRecette(recetteId);
  }

  @PutMapping("/{id}")
  public RecetteAlimentDTO update(@PathVariable Long id, @Valid @RequestBody RecetteAlimentCreateDTO in){
    return service.update(id, in);
  }

  @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id){ service.delete(id); }
}
