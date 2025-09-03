package com.example.api.web;

import com.example.api.dto.*;
import com.example.api.service.AlimentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aliments")
public class AlimentController {
  private final AlimentService service;
  public AlimentController(AlimentService service){ this.service = service; }

  @PostMapping
  public ResponseEntity<AlimentDTO> create(@Valid @RequestBody AlimentCreateDTO in){
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(in));
  }

  @GetMapping
  public Page<AlimentDTO> list(@RequestParam(defaultValue="0") int page,
                               @RequestParam(defaultValue="20") int size){
    return service.list(PageRequest.of(page, size, Sort.by("id").descending()));
  }

  @GetMapping("/{id}") public AlimentDTO get(@PathVariable Long id){ return service.get(id); }

  @PutMapping("/{id}") public AlimentDTO update(@PathVariable Long id, @Valid @RequestBody AlimentCreateDTO in){
    return service.update(id, in);
  }

  @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id){ service.delete(id); }
}
