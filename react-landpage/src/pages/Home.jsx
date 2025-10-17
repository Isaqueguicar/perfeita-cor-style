import React, { useState, useEffect } from 'react';
import Hero from '@components/sections/Hero';
import NewArrivals from '@components/sections/NewArrivals';
import FeaturedCategories from '@components/sections/FeaturedCategories';
import ProductDetailModal from '@components/modals/ProductDetailModal';
import { fetchCategoriesWithProducts, fetchProductDetails } from '../services/api';

const Home = ({ closeLoginModal }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <NewArrivals categories={categories} onProductSelect={handleProductSelect} />
      <FeaturedCategories categories={categories} />

      {isModalOpen && (
        <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default Home;
