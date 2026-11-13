package com.maoamiga.api.service;

import com.maoamiga.api.dto.PontoRequestDTO;
import com.maoamiga.api.dto.PontoResponseDTO;
import com.maoamiga.api.entity.Ponto;
import com.maoamiga.api.repository.PontoRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor 
public class PontoService {

    private final PontoRepository repository;

    public List<PontoResponseDTO> listar() {
        return repository.findAll().stream().map(PontoResponseDTO::from).toList();
    }

    public PontoResponseDTO buscar(UUID id) {
        return PontoResponseDTO.from(buscarEntidade(id));
    }

    public PontoResponseDTO cadastrar(PontoRequestDTO dto) {
        Ponto ponto = new Ponto(dto.nome(), dto.endereco(), dto.bairro(), dto.horario(), dto.tipo());
        return PontoResponseDTO.from(repository.save(ponto));
    }

    public PontoResponseDTO editar(UUID id, PontoRequestDTO dto) {
        Ponto ponto = buscarEntidade(id); // 404 se não existir
        ponto.setNome(dto.nome());
        ponto.setEndereco(dto.endereco());
        ponto.setBairro(dto.bairro());
        ponto.setHorario(dto.horario());
        ponto.setTipo(dto.tipo());
        return PontoResponseDTO.from(repository.save(ponto));
    }

    public void excluir(UUID id) {
        repository.delete(buscarEntidade(id)); // 404 se não existir
    }

    // Procura o ponto ou lança 404 (usado por buscar, editar e excluir)
    private Ponto buscarEntidade(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado"));
    }
}