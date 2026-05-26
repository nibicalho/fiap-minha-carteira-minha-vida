package br.com.fiap.fintechapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "T_MCMV_CATEGORIA")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long idCategoria;

    @Column(name = "nome_categoria", nullable = false)
    private String nomeCategoria;

    @Column(name = "tipo_categoria", nullable = false)
    private String tipoCategoria; 

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    public Categoria() {}

    // Getters e Setters
    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }
    public String getNomeCategoria() { return nomeCategoria; }
    public void setNomeCategoria(String nomeCategoria) { this.nomeCategoria = nomeCategoria; }
    public String getTipoCategoria() { return tipoCategoria; }
    public void setTipoCategoria(String tipoCategoria) { this.tipoCategoria = tipoCategoria; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}