package com.example.api.web;

import com.example.api.dto.*;
import com.example.api.service.RecetteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recettes")
public class RecetteController {
  private final RecetteService service;
  public RecetteController(RecetteService service){ this.service = service; }

  @PostMapping
  public ResponseEntity<RecetteDTO> create(@Valid @RequestBody RecetteCreateDTO in){
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(in));
  }

  @GetMapping
  public Page<RecetteDTO> list(@RequestParam(defaultValue="0") int page,
                               @RequestParam(defaultValue="20") int size){
    return service.list(PageRequest.of(page, size, Sort.by("id").descending()));
  }

  @GetMapping("/{id}") public RecetteDTO get(@PathVariable Long id){ return service.get(id); }

  @PutMapping("/{id}") public RecetteDTO update(@PathVariable Long id, @Valid @RequestBody RecetteCreateDTO in){
    return service.update(id, in);
  }

  @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id){ service.delete(id); }
}
