package br.com.fiap.fintechapp.repository;

import br.com.fiap.fintechapp.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Despesa d WHERE d.usuario.idUsuario = :idUsuario")
    void deleteByUsuarioId(Long idUsuario);

    @Transactional
    @Modifying
    @Query("DELETE FROM Despesa d WHERE d.categoria.idCategoria = :idCategoria")
    void deleteByCategoriaId(Long idCategoria);
}