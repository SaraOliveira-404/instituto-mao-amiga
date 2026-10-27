package com.maoamiga.api;

import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Um sort por campo que não existe (ex: sort=abc) responde 400 em vez de 500
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(PropertyReferenceException.class)
    public ResponseEntity<String> campoInvalido(PropertyReferenceException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Campo de ordenação inválido: " + e.getPropertyName());
    }
}
