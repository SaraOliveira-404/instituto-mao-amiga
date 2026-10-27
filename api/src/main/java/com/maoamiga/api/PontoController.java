package com.maoamiga.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/pontos")
public class PontoController {

    private final PontoRepository repository;

    public PontoController(PontoRepository repository) {
        this.repository = repository;
    }

    // GET /pontos?page=0&size=20&sort=nome,asc  (padrão: 20 por página, máximo 50)
    @GetMapping
    public Page<PontoResponse> listar(@PageableDefault(size = 20, sort = "nome") Pageable pageable) {
        return repository.findAll(pageable).map(PontoResponse::from);
    }

    // GET /pontos/{id}  -> 404 se não existir (e não 500)
    @GetMapping("/{id}")
    public PontoResponse buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(PontoResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado"));
    }
}
