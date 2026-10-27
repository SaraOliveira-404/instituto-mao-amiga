package com.maoamiga.api;

import org.springframework.data.jpa.repository.JpaRepository;

// Acesso ao banco: já traz findAll(Pageable), findById, count... sem escrever SQL
public interface PontoRepository extends JpaRepository<Ponto, Long> {
}
