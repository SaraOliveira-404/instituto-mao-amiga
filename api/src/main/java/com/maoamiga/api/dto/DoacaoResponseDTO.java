package com.maoamiga.api.dto;

import com.maoamiga.api.entity.Doacao;
import java.time.LocalDateTime;
import java.util.UUID;

public record DoacaoResponseDTO(
        UUID id,
        String tipoItem,
        Integer quantidade,
        String pontoDestino,
        String descricao,
        LocalDateTime criadoEm) {


    public static DoacaoResponseDTO from(Doacao d) {
        return new DoacaoResponseDTO(d.getId(), d.getTipoItem(), d.getQuantidade(),
                d.getPontoDestino(), d.getDescricao(), d.getCriadoEm());
    }
}