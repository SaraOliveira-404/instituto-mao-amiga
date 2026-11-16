package com.maoamiga.api.service;

import com.maoamiga.api.dto.DoacaoRequestDTO;
import com.maoamiga.api.dto.DoacaoResponseDTO;
import com.maoamiga.api.entity.Doacao;
import com.maoamiga.api.repository.DoacaoRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class doacoesService {

    private final DoacaoRepository repository;

    public Page<DoacaoResponseDTO> filtrar(String filtro, Pageable pageable) {
        String texto = filtro == null ? "" : filtro.trim();
        return repository.buscarPorTipo(texto, pageable).map(DoacaoResponseDTO::from);
    }

    public DoacaoResponseDTO buscar(UUID id) {
        return DoacaoResponseDTO.from(buscarEntidade(id)); 
    }

    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO dto) {
        Doacao doacao = new Doacao(dto.tipoItem().trim(), dto.quantidade(),
                dto.pontoDestino().trim(), dto.descricao(), LocalDateTime.now());
        return DoacaoResponseDTO.from(repository.save(doacao));
    }

    public DoacaoResponseDTO editar(UUID id, DoacaoRequestDTO dto) {
        Doacao doacao = buscarEntidade(id); 
        doacao.setTipoItem(dto.tipoItem().trim());
        doacao.setQuantidade(dto.quantidade());
        doacao.setPontoDestino(dto.pontoDestino().trim());
        doacao.setDescricao(dto.descricao());
        // criadoEm NÃO é alterado na edição
        return DoacaoResponseDTO.from(repository.save(doacao));
    }

    public void excluir(UUID id) {
        repository.delete(buscarEntidade(id)); 
    }

    private Doacao buscarEntidade(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doação não encontrada"));
    }
}