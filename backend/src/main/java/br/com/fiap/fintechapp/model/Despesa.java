package br.com.fiap.fintechapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "T_MCMV_DESPESA")
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_despesa")
    private Long idDespesa;

    @Column(name = "ds_motivo", nullable = false)
    private String motivo;

    @Column(name = "vl_despesa", nullable = false)
    private Double valor;

    @Column(name = "dt_despesa", nullable = false)
    private LocalDate data;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    public Despesa() {}

    // Getters e Setters
    public Long getIdDespesa() { return idDespesa; }
    public void setIdDespesa(Long idDespesa) { this.idDespesa = idDespesa; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}