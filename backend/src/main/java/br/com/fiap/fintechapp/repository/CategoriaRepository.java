package br.com.fiap.fintechapp.repository;

import br.com.fiap.fintechapp.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByUsuario_IdUsuario(Long idUsuario);
}