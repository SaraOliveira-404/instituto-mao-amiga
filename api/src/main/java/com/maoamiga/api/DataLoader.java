package com.maoamiga.api;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Carga inicial: roda ao subir a API e grava os 8 pontos de Goiânia se o banco estiver vazio.
// IMPORTANTE: confira/ajuste latitude e longitude no Google Maps (botão direito no local > copiar coordenadas).
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
            new Ponto("Ponto Central - Mercado São José",
                "Rua 15, nº 320, Setor Central, Goiânia - GO",
                "Seg a Sex, 8h às 17h",
                "Recebe doações de alimentos não perecíveis", -16.6799, -49.2550),
            new Ponto("Feira da Vila Nova",
                "Av. Anhanguera, esquina com Rua T-30, Vila Nova, Goiânia - GO",
                "Sáb, 6h às 12h",
                "Recebe frutas e verduras excedentes da feira", -16.6735, -49.2395),
            new Ponto("Centro Comunitário Jardim das Flores",
                "Rua das Acácias, nº 145, Jardim das Flores, Goiânia - GO",
                "Ter e Qui, 13h às 18h",
                "Distribui roupas e alimentos para famílias cadastradas", -16.6420, -49.3100),
            new Ponto("Paróquia São Francisco de Assis",
                "Praça São Francisco, nº 88, Setor Sul, Goiânia - GO",
                "Dom, 9h às 13h",
                "Recebe agasalhos e cobertores para o inverno", -16.6950, -49.2600),
            new Ponto("Escola Municipal Monteiro Lobato",
                "Rua 44, nº 210, Setor Bueno, Goiânia - GO",
                "Seg a Sex, 7h às 12h",
                "Recebe material escolar e livros usados", -16.7100, -49.2690),
            new Ponto("Associação de Moradores do Bairro Novo Mundo",
                "Av. Perimetral Norte, nº 1500, Novo Mundo, Goiânia - GO",
                "Qua e Sex, 14h às 19h",
                "Distribui cestas básicas para famílias cadastradas", -16.6300, -49.2850),
            new Ponto("Posto de Saúde Jardim Curitiba",
                "Rua J-15, nº 60, Jardim Curitiba, Goiânia - GO",
                "Seg a Sex, 8h às 16h",
                "Recebe fraldas geriátricas e produtos de higiene", -16.6000, -49.2900),
            new Ponto("Biblioteca Comunitária Vila Boa",
                "Rua 5, nº 320, Vila Boa, Goiânia - GO",
                "Ter a Sáb, 9h às 17h",
                "Distribui livros infantis e brinquedos educativos", -16.7000, -49.3000)
        ));
    }
}
