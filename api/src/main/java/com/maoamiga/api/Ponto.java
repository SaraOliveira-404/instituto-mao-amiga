package com.maoamiga.api;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Entidade JPA: vira a tabela "ponto" no H2. Nunca é devolvida direto pelo controller (veja PontoResponse).
@Entity
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;
    private String horario; // dias e horários de funcionamento
    private String recebeOuDistribui;
    private Double latitude;
    private Double longitude;

    protected Ponto() {} // exigido pelo JPA

    public Ponto(String nome, String endereco, String horario, String recebeOuDistribui,
                 Double latitude, Double longitude) {
        this.nome = nome;
        this.endereco = endereco;
        this.horario = horario;
        this.recebeOuDistribui = recebeOuDistribui;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEndereco() { return endereco; }
    public String getHorario() { return horario; }
    public String getRecebeOuDistribui() { return recebeOuDistribui; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
}
