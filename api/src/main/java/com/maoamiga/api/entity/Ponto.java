package com.maoamiga.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Entidade JPA: vira a tabela "ponto" no H2
@Entity
@Getter 
@Setter 
@NoArgsConstructor 
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) 
    private UUID id;

    private String nome;
    private String endereco;
    private String bairro; 
    private String horario; 
    private String tipo; 

    public Ponto(String nome, String endereco, String bairro, String horario, String tipo) {
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.horario = horario;
        this.tipo = tipo;
    }
}