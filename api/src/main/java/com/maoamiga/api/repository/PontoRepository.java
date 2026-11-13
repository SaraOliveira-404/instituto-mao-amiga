package com.maoamiga.api.repository;

import com.maoamiga.api.entity.Ponto;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PontoRepository extends JpaRepository<Ponto, UUID> { 
}