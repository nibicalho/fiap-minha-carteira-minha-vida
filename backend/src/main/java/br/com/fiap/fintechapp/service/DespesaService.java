package br.com.fiap.fintechapp.service;

import br.com.fiap.fintechapp.model.Despesa;
import br.com.fiap.fintechapp.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Camada de Serviço (Service) para a entidade Despesa.
 * 
 * Responsabilidades e Regras de Negócio:
 * - Centraliza o acesso aos dados via DespesaRepository, separando a lógica de negócio do Controller.
 * - Garante a consistência dos dados antes da persistência no Oracle DB. Por exemplo, impede transações com valor negativo, garantindo integridade contábil.
 * - Prepara o terreno para futuras integrações (ex: disparo de eventos ao cadastrar uma despesa, limites de alerta de gastos).
 */
@Service
public class DespesaService {

    @Autowired
    private DespesaRepository repository;

    public List<Despesa> listarTodos() { return repository.findAll(); }

    public Optional<Despesa> buscarPorId(Long id) { return repository.findById(id); }

    public Despesa salvar(Despesa despesa) { 
        // Regra de negócio simples: impede despesas com valor negativo
        if (despesa.getValor() < 0) {
            throw new IllegalArgumentException("O valor da despesa não pode ser negativo.");
        }
        return repository.save(despesa); 
    }

    public void deletar(Long id) { repository.deleteById(id); }
}