package com.maoamiga.api;

// DTO (record) devolvido pela API. O app espelha estes campos em src/types/ponto.ts.
public record PontoResponse(
        Long id,
        String nome,
        String endereco,
        String horario,
        String recebeOuDistribui,
        Double latitude,
        Double longitude) {

    // Converte a entidade no DTO
    public static PontoResponse from(Ponto p) {
        return new PontoResponse(p.getId(), p.getNome(), p.getEndereco(), p.getHorario(),
                p.getRecebeOuDistribui(), p.getLatitude(), p.getLongitude());
    }
}
