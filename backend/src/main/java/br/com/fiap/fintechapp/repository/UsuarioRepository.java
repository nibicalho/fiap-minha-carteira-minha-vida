package br.com.fiap.fintechapp.repository;

import br.com.fiap.fintechapp.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método customizado para podermos fazer login mais tarde
    Optional<Usuario> findByEmail(String email);
}