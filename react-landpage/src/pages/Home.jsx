import React, { useState, useEffect } from 'react';
import Hero from '@components/sections/Hero';
import NewArrivals from '@components/sections/NewArrivals';
import FeaturedCategories from '@components/sections/FeaturedCategories';
import ProductDetailModal from '@components/modals/ProductDetailModal';
import FilterModal from '@components/modals/FilterModal';
import { fetchCategoriesWithProducts, fetchProductDetails } from '../services/api';

const Home = ({ closeLoginModal }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [initialFilterCategory, setInitialFilterCategory] = useState(''); 
  
  const openFilterModal = (categoryId = '') => {
    console.log("Abrindo filtro com categoria inicial:", categoryId); 
    setInitialFilterCategory(categoryId);
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
    setInitialFilterCategory(''); 
  };

  const handleCategorySelect = (categoryId) => {
    console.log("Categoria selecionada em FeaturedCategories:", categoryId); 
    openFilterModal(categoryId); 
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoriesWithProducts();
        setCategories(data);
      } catch (error) {
        console.error("Falha ao carregar os dados da Home:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleProductSelect = async (productId) => {
    if (isFilterModalOpen) closeFilterModal(); 

    try {
      const productDetails = await fetchProductDetails(productId);
      if (productDetails && !productDetails.error) { 
        setSelectedProduct(productDetails);
        setIsModalOpen(true);
      } else if (productDetails && productDetails.error) {
         console.error("Erro ao buscar detalhes do produto:", productDetails.error);
         alert(`Não foi possível carregar os detalhes do produto: ${productDetails.error}`);
      } else {
         console.error("Produto não encontrado ou falha na API.");
         alert("Produto não encontrado ou falha ao buscar detalhes.");
      }
    } catch (apiError) {
       console.error("Erro na chamada da API fetchProductDetails:", apiError);
       alert("Ocorreu um erro ao buscar os detalhes do produto.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Hero />

      <NewArrivals
        categories={categories}
        onProductSelect={handleProductSelect}
        onOpenFilterModal={openFilterModal}
      />

      <FeaturedCategories
        categories={categories}
        onCategorySelect={handleCategorySelect} 
      />

      {isModalOpen && selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
      )}

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={closeFilterModal}
          onProductSelect={handleProductSelect}
          initialCategory={initialFilterCategory} 
        />
      )}
    </>
  );
};

export default Home;