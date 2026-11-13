package com.maoamiga.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// Dados que o app envia. Não tem id nem criadoEm: quem controla isso é a API.
public record DoacaoRequestDTO(
        @NotBlank(message = "tipoItem é obrigatório") String tipoItem,
        @NotNull(message = "quantidade é obrigatória")
        @Positive(message = "quantidade deve ser maior que zero")
        Integer quantidade,
        @NotBlank(message = "pontoDestino é obrigatório") String pontoDestino,
        String descricao) { 
}