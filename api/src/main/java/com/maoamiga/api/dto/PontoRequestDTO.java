package com.maoamiga.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PontoRequestDTO(
        @NotBlank(message = "nome é obrigatório") String nome,
        @NotBlank(message = "endereco é obrigatório") String endereco,
        @NotBlank(message = "bairro é obrigatório") String bairro,
        @NotBlank(message = "horario é obrigatório") String horario,
        @NotBlank(message = "tipo é obrigatório")
        @Pattern(regexp = "coleta|distribuição", message = "tipo deve ser 'coleta' ou 'distribuição'")
        String tipo) {
}