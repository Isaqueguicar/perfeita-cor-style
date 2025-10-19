import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import {
  fetchManageCategories,
  activateCategory,
  deactivateCategory,
  getImageUrl
} from '../../services/api';
import './ManageTables.css'; // Usando CSS genérico

const ManageCategories = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Estados para filtro e paginação
  const [filters, setFilters] = useState({ nome: '', situacao: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce para o filtro de nome
  const useDebounce = (value, delay) => {
      const [debouncedValue, setDebouncedValue] = useState(value);
      useEffect(() => {
          const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
          return () => { clearTimeout(handler); };
      }, [value, delay]);
      return debouncedValue;
  };
  const debouncedNome = useDebounce(filters.nome, 500); // 500ms de delay

  // Efeito para resetar a página quando os filtros mudam
  useEffect(() => {
    setPage(0);
  }, [debouncedNome, filters.situacao]);


  const loadCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchManageCategories({ nome: debouncedNome, situacao: filters.situacao }, page, token);
      setCategories(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Falha ao carregar categorias.');
      console.error("Erro em loadCategories (Admin):", err);
    } finally {
      setLoading(false);
    }
  }, [token, page, debouncedNome, filters.situacao]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleSituacao = async (categoryId, currentSituacao) => {
    if (updatingId) return;

    setUpdatingId(categoryId);
    setError('');
    const action = currentSituacao === 'ATIVO' ? deactivateCategory : activateCategory;
    const actionName = currentSituacao === 'ATIVO' ? 'inativar' : 'ativar';

    try {
      await action(categoryId, token);
      loadCategories(); // Recarrega a lista
    } catch (err) {
      setError(`Falha ao ${actionName} categoria: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEdit = (categoryId) => {
    navigate(`/admin/categorias/editar/${categoryId}`);
  };

  const handleCreate = () => {
    navigate(`/admin/categorias/nova`);
  };

  const getStatusClass = (status) => {
    return status === 'ATIVO' ? 'status-active' : 'status-inactive';
  };

  return (
    <div className="manage-page">
      <h1>Gerenciar Categorias</h1>

      {/* Barra de Filtros */}
      <div className="admin-filters-bar">
          <input
              type="text"
              name="nome"
              placeholder="Filtrar por nome..."
              value={filters.nome}
              onChange={handleFilterChange}
          />
          <select
              name="situacao"
              value={filters.situacao}
              onChange={handleFilterChange}
          >
              <option value="">Todas as Situações</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
          </select>
      </div>


      {error && <p className="error-message">{error}</p>}

      <div className="admin-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Carregando...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma categoria encontrada.</td></tr>
            ) : (
              categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    {/* CORREÇÃO APLICADA AQUI */}
                    <img
                      src={getImageUrl(category.imagemPath)}
                      alt={`Imagem ${category.nome}`}
                      className="table-thumbnail"
                      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/f1f5f9/64748b?text=Erro';}}
                    />
                  </td>
                  <td>{category.nome}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(category.situacao)}`}>
                      {category.situacao}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(category.id)}
                      disabled={!!updatingId}
                    >
                      Editar
                    </button>
                    {category.situacao === 'ATIVO' ? (
                      <button
                        className="action-btn deactivate-btn"
                        onClick={() => handleToggleSituacao(category.id, 'ATIVO')}
                        disabled={updatingId === category.id}
                      >
                        {updatingId === category.id ? '...' : 'Inativar'}
                      </button>
                    ) : (
                      <button
                        className="action-btn activate-btn"
                        onClick={() => handleToggleSituacao(category.id, 'INATIVO')}
                        disabled={updatingId === category.id}
                      >
                        {updatingId === category.id ? '...' : 'Ativar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

       {/* Controles de Paginação */}
      <div className="pagination-controls">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0 || loading}>
              Anterior
          </button>
          <span>
              Página {page + 1} de {totalPages || 1}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1 || loading}>
              Próxima
          </button>
      </div>


      <button
        className="add-fab"
        title="Adicionar Nova Categoria"
        onClick={handleCreate}
      >
        +
      </button>
    </div>
  );
};

export default ManageCategories;

