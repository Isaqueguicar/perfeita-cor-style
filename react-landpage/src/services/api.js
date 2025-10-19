const API_BASE_URL = 'http://localhost:8080';

/**
 * (PARA CLIENTE) Busca as categorias principais com seus produtos para a página inicial.
 */
export const fetchCategoriesWithProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria`);
    if (!response.ok) throw new Error('Falha ao buscar categorias com produtos.');
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchCategoriesWithProducts:", error);
    return [];
  }
};

/**
 * (PARA CLIENTE) Busca os detalhes de um único produto pelo ID.
 */
export const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/${productId}/detalhar`);
    if (!response.ok) throw new Error(`Falha ao buscar detalhes do produto ${productId}.`);
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchProductDetails:", error);
    return null;
  }
};

/**
 * (PARA CLIENTE) Busca a lista de categorias ATIVAS formatada para o seletor de filtros.
 */
export const fetchCategoriesForSelect = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/select-response`);
    if (!response.ok) throw new Error('Falha ao buscar lista de categorias para o filtro.');
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchCategoriesForSelect:", error);
    return [];
  }
};

/**
 * (PARA CLIENTE) Busca produtos filtrados com base nos parâmetros.
 */
export const fetchFilteredProducts = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.categoriaId) params.append('categoriaId', filters.categoriaId);
  if (filters.tamanho) params.append('tamanho', filters.tamanho);
  if (filters.nome) params.append('nome', filters.nome);
  if (filters.descricao) params.append('descricao', filters.descricao);
  if (filters.page) params.append('page', filters.page);
  params.append('size', filters.size || 10);

  try {
    const response = await fetch(`${API_BASE_URL}/api/produto?${params.toString()}`);
    if (!response.ok) {
       const errorData = await response.json().catch(() => null);
       throw new Error(errorData?.message || `Falha ao buscar produtos filtrados. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.content || [];
  } catch (error) {
    console.error("Erro em fetchFilteredProducts:", error);
    return [];
  }
};

/**
 * (PARA ADMIN) Busca a lista de TODAS as categorias para o filtro de gestão.
 */
export const fetchManageCategoriesForSelect = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/gerenciar/select-response`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar lista de categorias para gestão.');
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchManageCategoriesForSelect:", error);
    return [];
  }
};

/**
 * (PARA ADMIN) Busca produtos para o painel de gestão.
 */
export const fetchManageableProducts = async (filters, token) => {
  const params = new URLSearchParams();
  
  if (filters.categoriaId) params.append('categoriaId', filters.categoriaId);
  if (filters.tamanho) params.append('tamanho', filters.tamanho);
  if (filters.nome) params.append('nome', filters.nome);
  if (filters.descricao) params.append('descricao', filters.descricao);
  if (filters.situacao) params.append('situacao', filters.situacao);
  if (filters.page) params.append('page', filters.page);
  params.append('size', filters.size || 10);

  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/gerenciar?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
       const errorData = await response.json().catch(() => null);
       throw new Error(errorData?.message || `Falha ao buscar produtos para gestão. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchManageableProducts:", error);
    return { content: [], totalPages: 0, first: true, last: true, number: 0 };
  }
};

/**
 * (PARA ADMIN) Envia os dados de um novo produto para o backend.
 * @param {FormData} productData - Os dados do produto, incluindo imagens.
 * @param {string} token - O token de autenticação do admin.
 */
export const createProduct = async (productData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produto`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao cadastrar produto.' }));
      throw new Error(errorData.message || `Falha ao cadastrar produto. Status: ${response.status}`);
    }
    return true; 
  } catch (error) {
    console.error("Erro em createProduct:", error);
    throw error; 
  }
};

/**
 * Constrói a URL completa para uma imagem vinda do back-end.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://placehold.co/400x600/f0f5f1/0a4028?text=Imagem...';
  }
  return `${API_BASE_URL}/api/produto/imagem/${imagePath}`;
};

