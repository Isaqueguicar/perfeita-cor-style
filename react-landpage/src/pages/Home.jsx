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
  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

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

    const productDetails = await fetchProductDetails(productId);
    if (productDetails) {
      setSelectedProduct(productDetails);
      setIsModalOpen(true);
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
      
      <FeaturedCategories categories={categories} />

      {isModalOpen && (
        <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
      )}

      {isFilterModalOpen && (
        <FilterModal 
          isOpen={isFilterModalOpen} 
          onClose={closeFilterModal} 
          onProductSelect={handleProductSelect} 
        />
      )}
    </>
  );
};

export default Home;