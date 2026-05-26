import { useState, useEffect } from 'react';
import api from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import styles from './TransactionForm.module.css';

/**
 * TransactionForm Component
 * Formulário completo para criar uma nova transação.
 * 
 * Props:
 * - onSuccess {function}: Callback disparado após sucesso no cadastro.
 * - usuarioId {number|string}: ID do usuário atual para vincular a despesa.
 * - initialData {object}: Dados iniciais para edição (se passado, altera o comportamento para PUT).
 */
export default function TransactionForm({ onSuccess, usuarioId, initialData = null }) {
  const [tipo, setTipo] = useState(
    initialData ? ((initialData.categoria?.tipoCategoria || 'DESPESA').toUpperCase()) : 'DESPESA'
  );
  const [valorStr, setValorStr] = useState(
    initialData ? Math.abs(initialData.valor || 0).toFixed(2).replace('.', ',') : ''
  );
  const [descricao, setDescricao] = useState(
    initialData ? (initialData.motivo || '') : ''
  );
  const [data, setData] = useState(() => {
    if (initialData && initialData.data) {
      return initialData.data.split('T')[0];
    }
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  });
  const [categoriaId, setCategoriaId] = useState(
    initialData ? String(initialData.categoria?.idCategoria || '') : ''
  );
  
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Carregar categorias
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await api.get('/categorias');
        console.log(response.data);
        setCategorias(response.data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    }
    fetchCategorias();
  }, []);

  // Máscara monetária simples para digitação
  const handleValorChange = (e) => {
    let v = e.target.value.replace(/\D/g, ''); // só números
    if (v.length > 11) return; // Limita a 11 dígitos (até 999.999.999,99)
    if (!v) {
      setValorStr('');
      return;
    }
    v = (parseInt(v, 10) / 100).toFixed(2); // transforma em decimal
    // Formata visualmente para BRL locale "PT-BR"
    const formatado = v.replace('.', ',');
    setValorStr(formatado); // Ex: "1000,50" -> 1.000,50 precisa regex, mas para input simples assim já funciona visualmente
  };

  // Melhor máscara para valor (opcional, mantendo simples por enquanto)
  const formatarValorVisor = (valStr) => {
    if (!valStr) return '';
    const num = parseFloat(valStr.replace(',', '.'));
    if (isNaN(num)) return valStr;
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(num);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    if (!valorStr || !descricao || !data || !categoriaId) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setCarregando(true);

    try {
      // O Spring Boot espera valor numérico e se é despesa o ideal é o backend resolver ou enviarmos negativo se for despesa (mas normalmente envia-se absoluto e o backend decide ou enviamos o tipo). 
      // Vou assumir que o backend aceita valor numérico simples e tem o campo "tipo" ou apenas diferencia pela categoria/sinal.
      // Vou enviar o valor absoluto, e passar a categoria.
      const valorAbsoluto = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
      const valorFinal = Math.abs(valorAbsoluto);

      const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado') || '{}');
      const finalUsuarioId = usuarioId || usuarioLogado.idUsuario || usuarioLogado.id;

      const payload = {
        valor: valorFinal,
        motivo: descricao,
        data,
        usuario: { idUsuario: finalUsuarioId },
        categoria: { idCategoria: parseInt(categoriaId, 10) }
      };

      if (initialData && (initialData.idDespesa || initialData.id)) {
        const id = initialData.idDespesa || initialData.id;
        await api.put(`/despesas/${id}`, payload);
      } else {
        await api.post('/despesas', payload);
      }
      
      // Feedback de sucesso
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      setErro('Ocorreu um erro ao salvar a transação. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const opcoesCategoria = categorias
    .filter(c => c.tipoCategoria && c.tipoCategoria.toUpperCase() === tipo.toUpperCase())
    .map((c) => ({
      value: String(c.idCategoria),
      label: c.nomeCategoria,
    }));

  const isReceita = tipo === 'RECEITA';

  const handleChangeTipo = (novoTipo) => {
    if (tipo !== novoTipo) {
      setTipo(novoTipo);
      // Limpa apenas a categoria, pois a nova lista não conterá a anterior
      setCategoriaId('');
      setErro('');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* ── Segmented Control (Despesa / Receita) ── */}
      <div className={styles.segmentControl}>
        <button
          type="button"
          className={`${styles.segmentBtn} ${tipo === 'DESPESA' ? styles.segmentBtnAtivo : ''}`}
          onClick={() => handleChangeTipo('DESPESA')}
        >
          Despesa
        </button>
        <button
          type="button"
          className={`${styles.segmentBtn} ${tipo === 'RECEITA' ? styles.segmentBtnAtivo : ''}`}
          onClick={() => handleChangeTipo('RECEITA')}
        >
          Receita
        </button>
      </div>

      {erro && <div className={styles.erro}>{erro}</div>}

      {/* ── Campo Valor Principal ── */}
      <div className={styles.valorContainer}>
        <label htmlFor="transaction-value" className="sr-only">Valor</label>
        <div className={styles.valorInputWrapper}>
          <span className={`${styles.moeda} ${isReceita ? styles.moedaReceita : ''}`}>R$</span>
          <input
            id="transaction-value"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            className={`${styles.valorInput} ${isReceita ? styles.valorInputReceita : ''}`}
            value={formatarValorVisor(valorStr)}
            onChange={handleValorChange}
            autoComplete="off"
            required
          />
        </div>
      </div>

      {/* ── Outros Campos ── */}
      <div className={styles.camposGrid}>
        <Input
          icon="description"
          placeholder="Descrição da transação"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          maxLength={255}
        />
        
        <div className={styles.row}>
          {/* Data */}
          <div className={styles.col}>
            <Input
              type="date"
              leftIcon={<span className="material-symbols-outlined">calendar_today</span>}
              value={data}
              onChange={(e) => setData(e.target.value)}
              onMouseDown={(e) => {
                e.preventDefault();
                if (e.currentTarget.showPicker) e.currentTarget.showPicker();
              }}
              onKeyDown={(e) => {
                e.preventDefault();
                if ((e.key === 'Enter' || e.key === ' ') && e.currentTarget.showPicker) {
                  e.currentTarget.showPicker();
                }
              }}
              required
            />
          </div>
          {/* Categoria */}
          <div className={styles.col}>
            <Select
              icon="category"
              placeholder="Categorias"
              options={opcoesCategoria}
              value={categoriaId}
              onChange={(e) => {
                setCategoriaId(e.target.value);
                e.target.blur();
              }}
              required
            />
          </div>
        </div>
      </div>

      {/* ── Botão Submit ── */}
      <div className={styles.actionArea}>
        <Button 
          type="submit" 
          disabled={carregando}
          className={styles.submitBtn}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {carregando ? 'hourglass_empty' : 'check'}
          </span>
          {carregando ? 'Salvando...' : 'Salvar Transação'}
        </Button>
      </div>
    </form>
  );
}
