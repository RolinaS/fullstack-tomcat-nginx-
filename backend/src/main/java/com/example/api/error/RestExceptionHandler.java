package com.example.api.error;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class RestExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Map<String,Object>> handleNotFound(NotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
      "error", "NOT_FOUND",
      "message", ex.getMessage()
    ));
  }

  @ExceptionHandler(IllegalArgumentException.class)  
  public ResponseEntity<Map<String,Object>> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(Map.of("error","BAD_REQUEST","message",ex.getMessage()));
  }


  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
    var errors = ex.getBindingResult().getFieldErrors().stream()
      .collect(Collectors.groupingBy(
        fe -> fe.getField(),
        Collectors.mapping(fe -> fe.getDefaultMessage(), Collectors.toList())
      ));
    return ResponseEntity.badRequest().body(Map.of("error","VALIDATION","fields",errors));
  }
}
