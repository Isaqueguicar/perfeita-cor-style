import React from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Hero from '@components/sections/Hero';
import NewArrivals from '@components/sections/NewArrivals';
import FeaturedCategories from '@components/sections/FeaturedCategories';

const Home = () => (
  <div className="app-wrapper">
    <Header />
    <main className="main-content">
      <Hero />
      <NewArrivals />
      <FeaturedCategories />
    </main>
    <Footer />
  </div>
);

export default Home;
