import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '@components/cards/ProductCard';
import { fetchCategoriesForSelect, fetchFilteredProducts } from '../../services/api';
import './FilterModal.css';

const TAMANHOS_DISPONIVEIS = [
  { value: 'P', label: 'P' },
  { value: 'M', label: 'M' },
  { value: 'G', label: 'G' },
  { value: 'GG', label: 'GG' }
];

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


const FilterModal = ({ isOpen, onClose, onProductSelect, initialCategory }) => {
  const [products, setProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterCategoria, setFilterCategoria] = useState(initialCategory || '');
  const [filterTamanho, setFilterTamanho] = useState('');
  const [filterNome, setFilterNome] = useState('');
  const [filterDescricao, setFilterDescricao] = useState('');

  const debouncedNome = useDebounce(filterNome, 300);
  const debouncedDescricao = useDebounce(filterDescricao, 300);

  const handleBackdropClick = (e) => {
    if (e.target.id === 'filter-modal-backdrop') {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && initialCategory) {
        setFilterCategoria(initialCategory);
    }
  }, [isOpen, initialCategory]);


  useEffect(() => {
    const loadFilterOptions = async () => {
      const categoriesData = await fetchCategoriesForSelect();
      setAvailableCategories(categoriesData);
    };
    loadFilterOptions();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const filters = {
          categoriaId: filterCategoria,
          tamanho: filterTamanho,
          nome: debouncedNome,
          descricao: debouncedDescricao,
        };
        const productsData = await fetchFilteredProducts(filters);
        setProducts(productsData);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadProducts();
    }
  }, [filterCategoria, filterTamanho, debouncedNome, debouncedDescricao, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div id="filter-modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="filter-modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        <div className="filter-modal-header">
          <h2>Filtrar Produtos</h2>
          <div className="filters-bar-modal">
            <div className="filter-group">
              <label htmlFor="filter-categoria">Categoria</label>
              <select
                id="filter-categoria"
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
              >
                <option value="">Todas</option>
                {availableCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-tamanho">Tamanho</label>
              <select
                id="filter-tamanho"
                value={filterTamanho}
                onChange={(e) => setFilterTamanho(e.target.value)}
              >
                <option value="">Todos</option>
                {TAMANHOS_DISPONIVEIS.map((tam) => (
                  <option key={tam.value} value={tam.value}>
                    {tam.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-nome">Nome</label>
              <input
                type="text"
                id="filter-nome"
                value={filterNome}
                onChange={(e) => setFilterNome(e.target.value)}
                placeholder="Digite o nome..."
              />
            </div>
            <div className="filter-group">
              <label htmlFor="filter-descricao">Descrição</label>
              <input
                type="text"
                id="filter-descricao"
                value={filterDescricao}
                onChange={(e) => setFilterDescricao(e.target.value)}
                placeholder="Digite a descrição..."
              />
            </div>
          </div>
        </div>

        <div className="filter-modal-body">
          {loading ? (
            <p className="text-center">Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p className="text-center">Nenhum produto encontrado para estes filtros.</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const images = (product.customizacoes ?? [])
                  .filter(c => c.situacao === 'ATIVO' && c.imagem)
                  .map(c => c.imagem);

                return (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    onSelect={onProductSelect}
                    images={images}
                    title={product.nome}
                    price={product.preco}
                    alt={`Imagem do produto ${product.nome}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterModal;