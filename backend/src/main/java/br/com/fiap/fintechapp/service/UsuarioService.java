package br.com.fiap.fintechapp.service;

import br.com.fiap.fintechapp.model.Usuario;
import br.com.fiap.fintechapp.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import br.com.fiap.fintechapp.repository.DespesaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsável por encapsular as regras de negócio referentes à entidade {@link Usuario}.
 * 
 * <p>Integra-se ao {@link UsuarioRepository} para persistência de dados e ao 
 * {@link DespesaRepository} para lidar com deleções em cascata.</p>
 */
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private DespesaRepository despesaRepository;

    public List<Usuario> listarTodos() { return repository.findAll(); }

    public Optional<Usuario> buscarPorId(Long id) { return repository.findById(id); }

    public Usuario salvar(Usuario usuario) { return repository.save(usuario); }

    /**
     * Deleta o usuário do sistema.
     * 
     * <p><strong>Atenção:</strong> Esta operação apaga as despesas em cascata.
     * Como o banco de dados Oracle ou o modelo JPA atual pode não estar configurado
     * com "ON DELETE CASCADE" nativamente nas foreign keys de Transações,
     * apagamos manualmente primeiro todas as despesas vinculadas a este ID de usuário.</p>
     * 
     * @param id O identificador do usuário a ser deletado.
     */
    @Transactional
    public void deletar(Long id) {
        despesaRepository.deleteByUsuarioId(id);
        repository.deleteById(id);
    }
}