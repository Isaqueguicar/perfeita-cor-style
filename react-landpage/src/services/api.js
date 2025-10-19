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
 * (PARA CLIENTE E ADMIN) Busca os detalhes de um único produto pelo ID.
 * Usado na modal de detalhes (cliente) e na página de edição (admin).
 */
export const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/${productId}/detalhar`);
    if (!response.ok) {
       const errorData = await response.json().catch(() => null);
       const categoriaId = errorData?.categoriaId || (await fetch(`${API_BASE_URL}/api/produto/${productId}`).then(res => res.ok ? res.json() : {categoriaId: null}).then(d => d.categoriaId));
       const errorWithMessage = new Error(errorData?.message || `Falha ao buscar detalhes do produto ${productId}.`);
       errorWithMessage.categoriaId = categoriaId; 
       throw errorWithMessage;
    }
     const productData = await response.json();
     if (!productData.categoriaId) {
        try {
            const baseProduct = await fetch(`${API_BASE_URL}/api/produto/${productId}`).then(res => res.ok ? res.json() : {});
            productData.categoriaId = baseProduct.categoriaId;
        } catch(catError){
            console.warn("Não foi possível obter a categoriaId base do produto:", catError);
        }
     }
     return productData;
  } catch (error) {
    console.error("Erro em fetchProductDetails:", error);
    return error.categoriaId ? { error: error.message, categoriaId: error.categoriaId } : null;
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
  params.append('page', filters.page || 0); 
  params.append('size', filters.size || 10);

  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/gerenciar?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
       const errorData = await response.json().catch(() => null);
       throw new Error(errorData?.message || `Falha ao buscar produtos para gestão. Status: ${response.status}`);
    }
    const data = await response.json();
     return {
         content: data.content || [],
         totalPages: data.totalPages || 0,
         first: data.first === undefined ? true : data.first,
         last: data.last === undefined ? true : data.last,
         number: data.number || 0,
     };
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
 * (PARA ADMIN) Envia os dados de um produto para atualização.
 * @param {string|number} productId - O ID do produto a ser atualizado.
 * @param {FormData} productData - Os dados do produto, incluindo imagens.
 * @param {string} token - O token de autenticação do admin.
 */
export const updateProduct = async (productId, productData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao atualizar produto.' }));
      throw new Error(errorData.message || `Falha ao atualizar produto. Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Erro em updateProduct:", error);
    throw error;
  }
};

/**
 * (PARA ADMIN) Ativa um produto.
 * @param {string|number} productId - O ID do produto.
 * @param {string} token - O token de autenticação do admin.
 */
export const activateProduct = async (productId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/${productId}/ativar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao ativar produto.' }));
      throw new Error(errorData.message || `Falha ao ativar produto. Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Erro em activateProduct:", error);
    throw error;
  }
};

/**
 * (PARA ADMIN) Inativa um produto.
 * @param {string|number} productId - O ID do produto.
 * @param {string} token - O token de autenticação do admin.
 */
export const deactivateProduct = async (productId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/${productId}/inativar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao inativar produto.' }));
      throw new Error(errorData.message || `Falha ao inativar produto. Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Erro em deactivateProduct:", error);
    throw error;
  }
};


/**
 * (PARA CLIENTE) Cria uma nova reserva para um item de estoque específico.
 * @param {object} reservationData - { produtoCustomId: number, tamanho: string }
 * @param {string} token - Token de autenticação do cliente.
 */
export const createReservation = async (reservationData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reserva`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao criar reserva.' }));
      throw new Error(errorData.message || `Falha ao criar reserva. Status: ${response.status}`);
    }
    return await response.json(); 
  } catch (error) {
    console.error("Erro em createReservation:", error);
    throw error;
  }
};

/**
 * (PARA CLIENTE) Busca a lista de reservas do cliente logado.
 * @param {string} token - Token de autenticação do cliente.
 */
export const fetchMyReservations = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reserva/minhas-reservas`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar minhas reservas.');
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchMyReservations:", error);
    return [];
  }
};

/**
 * (PARA CLIENTE) Cancela uma reserva específica do cliente logado.
 * @param {number} reservationId - ID da reserva a ser cancelada.
 * @param {string} token - Token de autenticação do cliente.
 */
export const cancelMyReservation = async (reservationId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reserva/${reservationId}/cancelar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao cancelar reserva.' }));
      throw new Error(errorData.message || `Falha ao cancelar reserva. Status: ${response.status}`);
    }
    return await response.json(); 
  } catch (error) {
    console.error("Erro em cancelMyReservation:", error);
    throw error;
  }
};

/**
 * (PARA ADMIN) Busca todas as reservas registradas no sistema.
 * @param {string} token - Token de autenticação do admin.
 */
export const fetchAllReservationsAdmin = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reserva/admin`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar todas as reservas para admin.');
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchAllReservationsAdmin:", error);
    return [];
  }
};

/**
 * (PARA ADMIN) Atualiza o status e/ou observação de uma reserva.
 * @param {number} reservationId - ID da reserva a ser atualizada.
 * @param {object} updateData - { status: string, observacaoAdmin?: string }
 * @param {string} token - Token de autenticação do admin.
 */
export const updateReservationAdmin = async (reservationId, updateData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reserva/admin/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao atualizar reserva.' }));
      throw new Error(errorData.message || `Falha ao atualizar reserva. Status: ${response.status}`);
    }
    return await response.json(); 
  } catch (error) {
    console.error("Erro em updateReservationAdmin:", error);
    throw error;
  }
};

/**
 * (PARA CLIENTE) Busca a lista de notificações de reserva pendentes para o cliente logado.
 * @param {string} token - Token de autenticação do cliente.
 */
export const fetchMyPendingNotifications = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reserva/minhas-notificacoes-pendentes`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar notificações pendentes.');
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchMyPendingNotifications:", error);
    return []; 
  }
};

/**
 * (PARA CLIENTE) Marca uma notificação de reserva específica como lida.
 * @param {number} reservationId - ID da reserva (notificação) a ser marcada como lida.
 * @param {string} token - Token de autenticação do cliente.
 */
export const markNotificationAsRead = async (reservationId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reserva/${reservationId}/marcar-vista`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        if (response.status === 204) return true; 
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao marcar notificação como lida.' }));
        throw new Error(errorData.message || `Falha ao marcar notificação como lida. Status: ${response.status}`);
    }
    return true; 
  } catch (error) {
    console.error("Erro em markNotificationAsRead:", error);
    throw error; 
  }
};/**
 * (PARA ADMIN) Busca a lista paginada e filtrada de TODAS as categorias para a tabela de gestão.
 * @param {object} filters - Objeto com os filtros (nome, situacao).
 * @param {number} page - O número da página a ser buscada.
 * @param {string} token - Token de autenticação do admin.
 */
export const fetchManageCategories = async (filters, page, token) => {
  try {
    const params = new URLSearchParams();
    if (filters.nome) params.append('nome', filters.nome);
    if (filters.situacao) params.append('situacao', filters.situacao);
    params.append('page', Number.isInteger(page) ? page : 0);
    params.append('size', 10);

    const response = await fetch(`${API_BASE_URL}/api/categoria/gerenciar?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao buscar categorias para gestão.');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchManageCategories:", error);
    return { content: [], totalPages: 0, first: true, last: true, number: 0 };
  }
};

/**
 * (PARA ADMIN) Busca os detalhes de uma única categoria.
 * @param {number|string} categoryId - O ID da categoria.
 * @param {string} token - Token de autenticação do admin.
 */
export const fetchCategoryDetails = async (categoryId, token) => {
    try {
        // ATENÇÃO: Este endpoint GET /api/categoria/{id} precisa ser criado no backend.
        // Se o endpoint for /api/categoria/admin/{id}, ajuste a URL abaixo.
        const response = await fetch(`${API_BASE_URL}/api/categoria/${categoryId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao buscar detalhes da categoria.');
        }
        return await response.json();
    } catch (error) {
        console.error("Erro em fetchCategoryDetails:", error);
        throw error;
    }
};


/**
 * (PARA ADMIN) Envia os dados de uma nova categoria para o backend.
 * @param {FormData} categoryData - Dados da categoria (nome, imagem).
 * @param {string} token - O token de autenticação do admin.
 */
export const createCategory = async (categoryData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: categoryData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em createCategory:", error);
    throw error;
  }
};

/**
 * (PARA ADMIN) Envia os dados de uma categoria para atualização.
 * @param {number|string} categoryId - O ID da categoria.
 * @param {FormData} categoryData - Dados da categoria.
 * @param {string} token - O token de autenticação do admin.
 */
export const updateCategory = async (categoryId, categoryData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/${categoryId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: categoryData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em updateCategory:", error);
    throw error;
  }
};

/**
 * (PARA ADMIN) Ativa uma categoria.
 * @param {number|string} categoryId - O ID da categoria.
 * @param {string} token - O token de autenticação do admin.
 */
export const activateCategory = async (categoryId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/${categoryId}/ativar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.status !== 204) throw new Error('Falha ao ativar categoria.');
    return true;
  } catch (error) {
    console.error("Erro em activateCategory:", error);
    throw error;
  }
};

/**
 * (PARA ADMIN) Inativa uma categoria.
 * @param {number|string} categoryId - O ID da categoria.
 * @param {string} token - O token de autenticação do admin.
 */
export const deactivateCategory = async (categoryId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/${categoryId}/inativar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.status !== 204) throw new Error('Falha ao inativar categoria.');
    return true;
  } catch (error) {
    console.error("Erro em deactivateCategory:", error);
    throw error;
  }
};


/**
 * Constrói a URL completa para uma imagem vinda do back-end,
 * diferenciando entre imagens de PRODUTO e CATEGORIA.
 * @param {string} imagePath - O caminho completo do arquivo (ex: "CATEGORIA/2025/10/...")
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://placehold.co/400x600/f0f5f1/0a4028?text=Sem+Imagem';
  }

  if (imagePath.startsWith('blob:') || imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.toUpperCase().startsWith('CATEGORIA')) {
    return `${API_BASE_URL}/api/categoria/imagem/${imagePath}`;
  } else {
    return `${API_BASE_URL}/api/produto/imagem/${imagePath}`;
  }
};
