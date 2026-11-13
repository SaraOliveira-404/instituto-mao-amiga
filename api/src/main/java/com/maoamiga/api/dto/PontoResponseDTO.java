package com.maoamiga.api.dto;

import com.maoamiga.api.entity.Ponto;
import java.util.UUID;

// DTO devolvido pela API: o controller nunca devolve a entidade.
public record PontoResponseDTO(
        UUID id, 
        String nome,
        String endereco,
        String bairro, 
        String horario,
        String tipo) { 

    // Converte a entidade no DTO
    public static PontoResponseDTO from(Ponto p) {
        return new PontoResponseDTO(p.getId(), p.getNome(), p.getEndereco(),
                p.getBairro(), p.getHorario(), p.getTipo());
    }
}