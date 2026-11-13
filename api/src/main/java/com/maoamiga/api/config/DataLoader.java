package com.maoamiga.api.config;

import com.maoamiga.api.entity.Ponto;
import com.maoamiga.api.repository.PontoRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final PontoRepository repository;

    public DataLoader(PontoRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.saveAll(List.of(
            new Ponto("Ponto Central - Mercado São José", "Rua 15, nº 320", "Setor Central",
                "Seg a Sex, 8h às 17h", "coleta"),
            new Ponto("Feira da Vila Nova", "Av. Anhanguera, esquina com Rua T-30", "Vila Nova",
                "Sáb, 6h às 12h", "coleta"),
            new Ponto("Centro Comunitário Jardim das Flores", "Rua das Acácias, nº 145", "Jardim das Flores",
                "Ter e Qui, 13h às 18h", "distribuição"),
            new Ponto("Paróquia São Francisco de Assis", "Praça São Francisco, nº 88", "Setor Sul",
                "Dom, 9h às 13h", "coleta"),
            new Ponto("Escola Municipal Monteiro Lobato", "Rua 44, nº 210", "Setor Bueno",
                "Seg a Sex, 7h às 12h", "coleta"),
            new Ponto("Associação de Moradores Novo Mundo", "Av. Perimetral Norte, nº 1500", "Novo Mundo",
                "Qua e Sex, 14h às 19h", "distribuição"),
            new Ponto("Posto de Saúde Jardim Curitiba", "Rua J-15, nº 60", "Jardim Curitiba",
                "Seg a Sex, 8h às 16h", "coleta"),
            new Ponto("Biblioteca Comunitária Vila Boa", "Rua 5, nº 320", "Vila Boa",
                "Ter a Sáb, 9h às 17h", "distribuição")
        ));
    }
}