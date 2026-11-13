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
                "Ter a Sáb, 9h às 17h", "distribuição"),
            new Ponto("Banco de Alimentos Marista", "Rua 1, nº 450", "Setor Marista",
                "Seg a Sex, 8h às 17h", "coleta"),
            new Ponto("Igreja Batista do Setor Oeste", "Rua 6, nº 112", "Setor Oeste",
                "Sáb, 8h às 12h", "coleta"),
            new Ponto("Centro de Referência Campinas", "Av. Independência, nº 2300", "Campinas",
                "Seg a Sex, 8h às 16h", "distribuição"),
            new Ponto("Associação Jardim América", "Rua C-100, nº 75", "Jardim América",
                "Ter e Qui, 9h às 15h", "distribuição"),
            new Ponto("Escola Estadual Universitário", "Rua 240, nº 33", "Setor Universitário",
                "Seg a Sex, 7h às 11h", "coleta"),
            new Ponto("Clube de Mães Jardim Goiás", "Rua 10, nº 500", "Jardim Goiás",
                "Qua, 14h às 18h", "distribuição"),
            new Ponto("Centro Social Parque Amazônia", "Av. Pedro Paulo, nº 890", "Parque Amazônia",
                "Seg a Sex, 8h às 17h", "coleta"),
            new Ponto("Paróquia Nossa Senhora Aparecida", "Rua 20, nº 140", "Setor Pedro Ludovico",
                "Dom, 8h às 12h", "coleta"),
            new Ponto("Cozinha Comunitária Vila Rosa", "Rua 3, nº 67", "Vila Rosa",
                "Seg a Sex, 10h às 14h", "distribuição"),
            new Ponto("Biblioteca Leste Universitário", "Rua 235, nº 12", "Setor Leste Universitário",
                "Ter a Sex, 9h às 17h", "coleta"),
            new Ponto("Associação Novo Mundo Solidário", "Rua NM-4, nº 28", "Jardim Novo Mundo",
                "Sáb, 9h às 13h", "distribuição"),
            new Ponto("Centro Comunitário Cidade Jardim", "Av. Cidade Jardim, nº 700", "Cidade Jardim",
                "Qua e Sex, 13h às 17h", "coleta"),
            new Ponto("Posto de Coleta Setor Aeroporto", "Av. Contorno, nº 1010", "Setor Aeroporto",
                "Seg a Sex, 8h às 16h", "coleta"),
            new Ponto("Igreja Vila Redenção", "Rua R-2, nº 95", "Vila Redenção",
                "Dom, 9h às 12h", "coleta"),
            new Ponto("Espaço Solidário Sudoeste", "Rua 9, nº 305", "Setor Sudoeste",
                "Ter e Qui, 14h às 18h", "distribuição"),
            new Ponto("Creche Comunitária Bela Vista", "Rua B-7, nº 41", "Setor Bela Vista",
                "Seg a Sex, 7h às 16h", "coleta"),
            new Ponto("Centro Social Eldorado", "Av. Eldorado, nº 1200", "Residencial Eldorado",
                "Sáb, 8h às 14h", "distribuição")
        ));
    }
}