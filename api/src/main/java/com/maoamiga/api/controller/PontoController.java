package com.maoamiga.api.controller;

import com.maoamiga.api.dto.PontoRequestDTO;
import com.maoamiga.api.dto.PontoResponseDTO;
import com.maoamiga.api.service.PontoService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/v1/pontos") 
@CrossOrigin(origins = "*") 
@RequiredArgsConstructor
public class PontoController {

    private final PontoService service; 

    // GET /api/v1/pontos
    @GetMapping
    public List<PontoResponseDTO> listar() {
        return service.listar();
    }

    // GET /api/v1/pontos/{id}  
    @GetMapping("/{id}")
    public PontoResponseDTO buscar(@PathVariable UUID id) {
        return service.buscar(id);
    }

    // GET /api/v1/pontos/filtro?filtro=vila&tipo=coleta&page=0&size=10&sort=bairro,asc
    @GetMapping("/filtro")
    public Page<PontoResponseDTO> filtrar(
            @RequestParam(defaultValue = "") String filtro,
            @RequestParam(defaultValue = "") String tipo, 
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return service.filtrar(filtro, tipo, pageable);
    }

    // POST /api/v1/pontos  
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PontoResponseDTO cadastrar(@Valid @RequestBody PontoRequestDTO dto) {
        return service.cadastrar(dto);
    }

    // PUT /api/v1/pontos/{id} 
    @PutMapping("/{id}")
    public PontoResponseDTO editar(@PathVariable UUID id, @Valid @RequestBody PontoRequestDTO dto) {
        return service.editar(id, dto);
    }

    // DELETE /api/v1/pontos/{id} 
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        service.excluir(id);
    }
}