import React, { useState, useEffect } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Hero from '@components/sections/Hero';
import NewArrivals from '@components/sections/NewArrivals';
import FeaturedCategories from '@components/sections/FeaturedCategories';
import ProductDetailModal from '@components/modals/ProductDetailModal';
import { fetchCategoriesWithProducts, fetchProductDetails } from '../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCategoriesWithProducts();
      setCategories(data);
      setLoading(false);
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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Hero />
        <NewArrivals categories={categories} onProductSelect={handleProductSelect} />
        <FeaturedCategories categories={categories} />
      </main>
      <Footer />

      {isModalOpen && (
        <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;