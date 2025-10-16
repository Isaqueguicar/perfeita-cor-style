const API_BASE_URL = 'http://localhost:8080';

export const fetchCategoriesWithProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria`);
    if (!response.ok) throw new Error('Falha ao buscar categorias.');
    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};

/**
 * Busca os detalhes de um único produto pelo ID.
 * @param {number} productId - O ID do produto a ser buscado.
 */
export const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produto/${productId}/detalhar`);
    if (!response.ok) throw new Error(`Falha ao buscar detalhes do produto ${productId}.`);
    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    return null; // Retorna nulo em caso de erro
  }
};

/**
 * Constrói a URL completa para uma imagem vinda do back-end.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  return `${API_BASE_URL}/api/produto/imagem/${imagePath}`;
};