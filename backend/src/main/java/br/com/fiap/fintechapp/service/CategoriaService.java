package br.com.fiap.fintechapp.service;

import br.com.fiap.fintechapp.model.Categoria;
import br.com.fiap.fintechapp.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import br.com.fiap.fintechapp.repository.DespesaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsável pela gestão de entidades {@link Categoria}.
 * 
 * <p>Nesta aplicação (Minha Carteira, Minha Vida), as Categorias são globais ou por usuário.
 * O campo 'tipoCategoria' do banco de dados (Oracle) tipicamente possui check constraints 
 * rigorosas (ex: apenas "RECEITA" ou "DESPESA" em uppercase). Validações podem ocorrer em nível de BD.</p>
 */
@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private DespesaRepository despesaRepository;

    public List<Categoria> listarTodos() { return repository.findAll(); }

    public List<Categoria> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuario_IdUsuario(idUsuario);
    }

    public Optional<Categoria> buscarPorId(Long id) { return repository.findById(id); }

    /**
     * Salva ou atualiza a categoria.
     * <p>Atenção à Constraint ORA-02290: A coluna 'tipo_categoria' possui restrições 
     * restritas do banco Oracle (geralmente só aceita 'DESPESA' e 'RECEITA').
     * O frontend deve garantir que a String venha padronizada.</p>
     */
    public Categoria salvar(Categoria categoria) { return repository.save(categoria); }

    /**
     * Deleta a Categoria do banco de dados.
     * 
     * <p><strong>Regra de Negócio:</strong> Para evitar violações de FK, apagamos as 
     * transações (Despesas/Receitas) que dependem desta Categoria primeiro.</p>
     */
    @Transactional
    public void deletar(Long id) {
        despesaRepository.deleteByCategoriaId(id);
        repository.deleteById(id);
    }
}