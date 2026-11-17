package com.maoamiga.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String tipoItem;
    private Integer quantidade;
    private String pontoDestino; 
    private String descricao;    
    private LocalDateTime criadoEm; 

    public Doacao(String tipoItem, Integer quantidade, String pontoDestino,
                  String descricao, LocalDateTime criadoEm) {
        this.tipoItem = tipoItem;
        this.quantidade = quantidade;
        this.pontoDestino = pontoDestino;
        this.descricao = descricao;
        this.criadoEm = criadoEm;
    }
}