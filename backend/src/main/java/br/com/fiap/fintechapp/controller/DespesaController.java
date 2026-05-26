package br.com.fiap.fintechapp.controller;

import br.com.fiap.fintechapp.model.Despesa;
import br.com.fiap.fintechapp.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST responsável pelo gerenciamento de Despesas e Receitas (Transações).
 * 
 * Arquitetura e Integração:
 * - Expõe endpoints RESTful (GET, POST, PUT, DELETE) consumidos pelo Front-end em React (Axios).
 * - O @CrossOrigin("*") foi adotado para facilitar o desenvolvimento local (evitando bloqueios de CORS do Vite rodando na porta 5173). Em produção, este valor deve ser restrito ao domínio oficial da aplicação.
 * - Por praticidade no escopo acadêmico (FIAP), o Controller recebe e devolve diretamente as Entidades JPA (Despesa.java), omitindo a camada de DTOs (Data Transfer Objects).
 */
@RestController
@RequestMapping("/despesas")
@CrossOrigin("*")
public class DespesaController {

    @Autowired
    private DespesaService service;

    @GetMapping
    public ResponseEntity<List<Despesa>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> buscarPorId(@PathVariable Long id) {
        Optional<Despesa> despesa = service.buscarPorId(id);
        return despesa.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Despesa> criar(@RequestBody Despesa despesa) {
        Despesa novaDespesa = service.salvar(despesa);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaDespesa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> atualizar(@PathVariable Long id, @RequestBody Despesa despesa) {
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        despesa.setIdDespesa(id);
        return ResponseEntity.ok(service.salvar(despesa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}