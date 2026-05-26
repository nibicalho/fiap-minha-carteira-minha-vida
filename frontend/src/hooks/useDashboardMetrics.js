import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const CORES_CATEGORIA = [
  '#003a55', '#35647a', '#2a6486', '#97cdf3', '#f59e0b',
  '#2e7d32', '#7b1fa2', '#e65100', '#37474f',
];

export default function useDashboardMetrics(usuario, mesAno) {
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    if (!usuario) return;
    setCarregando(true);
    setErro('');
    try {
      const [resDespesas, resCategorias] = await Promise.all([
        api.get('/despesas'),
        api.get('/categorias'),
      ]);
      setDespesas(resDespesas.data);
      setCategorias(resCategorias.data);
    } catch {
      setErro('Não foi possível carregar os dados. Verifique se o backend está ativo.');
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados();
  }, [carregarDados]);

  const currentUserId = usuario?.idUsuario || usuario?.id;
  
  const despesasDoUsuario = despesas.filter((d) => {
    const transUserId = d.usuario?.idUsuario || d.usuario?.id || d.usuarioId;
    return transUserId && currentUserId && transUserId === currentUserId;
  });

  const ehReceita = (d) => {
    const tipo = d.categoria?.tipoCategoria || '';
    return tipo.toUpperCase() === 'RECEITA';
  };

  // 1. Saldo Geral
  const totalReceitasGeral = despesasDoUsuario.filter(ehReceita).reduce((acc, d) => acc + (d.valor || 0), 0);
  const totalDespesasGeral = despesasDoUsuario.filter(d => !ehReceita(d)).reduce((acc, d) => acc + (d.valor || 0), 0);
  const saldoGeral = totalReceitasGeral - totalDespesasGeral;

  // 2. Resumo do Mês
  const transacoesDoMes = despesasDoUsuario.filter(d => d.data && d.data.startsWith(mesAno));
  const receitasDoMes = transacoesDoMes.filter(ehReceita);
  const despesasDoMes = transacoesDoMes.filter(d => !ehReceita(d));

  const totalReceitasMes = receitasDoMes.reduce((acc, d) => acc + (d.valor || 0), 0);
  const totalDespesasMes = despesasDoMes.reduce((acc, d) => acc + (d.valor || 0), 0);

  const pctEntradas = totalReceitasMes + totalDespesasMes > 0 
    ? Math.round((totalReceitasMes / (totalReceitasMes + totalDespesasMes)) * 100) 
    : 0;
  const pctSaidas = totalReceitasMes + totalDespesasMes > 0 ? 100 - pctEntradas : 0;

  // 3. Diagnóstico do Mês
  let despesasPorCategoria = categorias
    .filter(cat => cat.tipoCategoria !== 'RECEITA')
    .map((cat, idx) => {
      const catId = cat.idCategoria || cat.id;
      const total = despesasDoMes
        .filter((d) => {
           const dCatId = d.categoria?.idCategoria || d.categoriaId;
           return dCatId === catId;
        })
        .reduce((acc, d) => acc + (d.valor || 0), 0);

      return { ...cat, total, cor: CORES_CATEGORIA[idx % CORES_CATEGORIA.length] };
    })
    .filter((c) => c.total > 0);

  despesasPorCategoria.sort((a, b) => b.total - a.total);

  const maxTotal = despesasPorCategoria.length > 0 ? despesasPorCategoria[0].total : 0;
  despesasPorCategoria = despesasPorCategoria.map((cat) => {
    const pct = maxTotal > 0 ? (cat.total / maxTotal) * 100 : 0;
    return { ...cat, pct };
  });

  return {
    carregando,
    erro,
    carregarDados,
    despesasDoUsuario,
    saldoGeral,
    totalReceitasMes,
    totalDespesasMes,
    pctEntradas,
    pctSaidas,
    despesasPorCategoria
  };
}
