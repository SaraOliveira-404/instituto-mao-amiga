package com.maoamiga.api.repository;

import com.maoamiga.api.entity.Doacao;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoacaoRepository extends JpaRepository<Doacao, UUID> {

    @Query("SELECT d FROM Doacao d " +
           "WHERE LOWER(d.tipoItem) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    Page<Doacao> buscarPorTipo(@Param("filtro") String filtro, Pageable pageable);
}