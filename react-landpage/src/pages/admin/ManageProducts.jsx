import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { fetchCategoriesForSelect, fetchManageableProducts } from '../../services/api';
import './ManageProducts.css';

const TAMANHOS_DISPONIVEIS = ['P', 'M', 'G', 'GG'];
const SITUACOES_DISPONIVEIS = ['ATIVO', 'INATIVO']; 

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ManageProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 1,
    isFirst: true,
    isLast: true,
  });

  const [filters, setFilters] = useState({
    nome: '',
    descricao: '',
    categoriaId: '',
    tamanho: '',
    situacao: '', 
  });

  const debouncedNome = useDebounce(filters.nome, 300);
  const debouncedDescricao = useDebounce(filters.descricao, 300);

  useEffect(() => {
    fetchCategoriesForSelect().then(setCategories);
  }, []);

  useEffect(() => {
    if (token) {
      setLoading(true);
      const currentFilters = { 
        categoriaId: filters.categoriaId,
        tamanho: filters.tamanho,
        situacao: filters.situacao,
        nome: debouncedNome, 
        descricao: debouncedDescricao,
        page: pageInfo.currentPage,
      };
      
      fetchManageableProducts(currentFilters, token)
        .then(data => {
          setProducts(data.content || []);
          setPageInfo({
            currentPage: data.number,
            totalPages: data.totalPages,
            isFirst: data.first,
            isLast: data.last,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [token, filters.categoriaId, filters.tamanho, filters.situacao, debouncedNome, debouncedDescricao, pageInfo.currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPageInfo(prev => ({ ...prev, currentPage: 0 }));
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNextPage = () => {
    if (!pageInfo.isLast) {
      setPageInfo(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (!pageInfo.isFirst) {
      setPageInfo(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const getStatusClass = (status) => {
    return status === 'ATIVO' ? 'status-active' : 'status-inactive';
  };

  return (
    <div className="manage-products-page">
      <h1>Gerenciar Produtos</h1>

      <div className="admin-filters-bar">
        <input type="text" name="nome" placeholder="Filtrar por nome..." value={filters.nome} onChange={handleFilterChange} />
        <input type="text" name="descricao" placeholder="Filtrar por descrição..." value={filters.descricao} onChange={handleFilterChange} />
        <select name="categoriaId" value={filters.categoriaId} onChange={handleFilterChange}>
          <option value="">Todas as Categorias</option>
          {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
        </select>
        <select name="tamanho" value={filters.tamanho} onChange={handleFilterChange}>
          <option value="">Todos os Tamanhos</option>
          {TAMANHOS_DISPONIVEIS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="situacao" value={filters.situacao} onChange={handleFilterChange}>
          <option value="">Todas as Situações</option>
          {SITUACOES_DISPONIVEIS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6">Carregando...</td></tr>
            ) : products.length > 0 ? (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nome}</td>
                  <td>{product.categoria}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}</td>
                  <td><span className={`status-badge ${getStatusClass(product.situacao)}`}>{product.situacao}</span></td>
                  <td>
                    <button className="action-btn edit-btn">Editar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={pageInfo.isFirst || loading}>
          Anterior
        </button>
        <span>
          Página {pageInfo.currentPage + 1} de {pageInfo.totalPages}
        </span>
        <button onClick={handleNextPage} disabled={pageInfo.isLast || loading}>
          Próxima
        </button>
      </div>
      
      <button className="add-product-fab" title="Adicionar Novo Produto">+</button>
    </div>
  );
};

export default ManageProducts;