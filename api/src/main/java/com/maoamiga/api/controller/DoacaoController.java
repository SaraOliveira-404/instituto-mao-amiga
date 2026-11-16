package com.maoamiga.api.controller;

import com.maoamiga.api.dto.DoacaoRequestDTO;
import com.maoamiga.api.dto.DoacaoResponseDTO;
import com.maoamiga.api.service.doacoesService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DoacaoController {

    private final doacoesService service;

    // GET /api/v1/doacoes/filtro?filtro=roupa&page=0&size=10  
    @GetMapping("/filtro")
    public Page<DoacaoResponseDTO> filtrar(
            @RequestParam(defaultValue = "") String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.filtrar(filtro, pageable);
    }

    // GET /api/v1/doacoes/{id}  
    @GetMapping("/{id}")
    public DoacaoResponseDTO buscar(@PathVariable UUID id) {
        return service.buscar(id);
    }

    // POST /api/v1/doacoes  
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoacaoResponseDTO cadastrar(@Valid @RequestBody DoacaoRequestDTO dto) {
        return service.cadastrar(dto);
    }

    // PUT /api/v1/doacoes/{id}  
    @PutMapping("/{id}")
    public DoacaoResponseDTO editar(@PathVariable UUID id, @Valid @RequestBody DoacaoRequestDTO dto) {
        return service.editar(id, dto);
    }

    // DELETE /api/v1/doacoes/{id}  
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        service.excluir(id);
    }
}