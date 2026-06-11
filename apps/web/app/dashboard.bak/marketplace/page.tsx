'use client';

import { useState } from 'react';

const categories = ['All', 'Fashion', 'Electronics', 'Art', 'Music', 'Services'];

const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    seller: 'SoundGear HQ',
    price: 15000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUzcbE6zNIyUN_M3C0L8jLBQNMMnDb1xvjJylgEX4Dgy_Ox09J-vV9mkjhG0fkQmFpZXIlyjw5wnc49uRxB2xSUk4KaMmVNsjBLgqwjsbQF4jdmktb5aJnyUYVUBWDRP0YCCXDcS6v994YqNpW7j3a3YNE9iaJRGLIzTDpuJySbGpBhlAwbnlbnGrVKU5iAA0d0UsUqiOSQppc6DC7-56oXeIXleNfnz9LQGr4Q4Lt_EgmxUNaJhnbPzefT-3Qh1AeFsuLYG_iKUn4',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Lagos Threads Hoodie',
    seller: 'Lagos Threads Co.',
    price: 8500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQFb9DUF4SIVsV5ivO9PJrFr-GyMgBiZl7tYZPtaT7KrlSZtkhy38JJpALnUMmN5fofD_jOS3QrGWdu4w2CbXNemiuESOAZOm4haR_GLvNGeK9VLAZmLnw4-7K3W8wD31fbGUZ3D9mKz1z3AZL1_nEMOXLVq3sPq-IVttFDDl0N1pCVJGXmdL1kEA4-p3iZ7X8NasY2k3ujw1vgZi67jIe1FcgSDO6gpO_G5KTaeGmp9-vfqa6GpnjJDqVbgjnQ-rslMl92iEadV0X',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Digital Art Canvas',
    seller: 'Canvas & Co',
    price: 12000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIuvh94i6PnfXUwM7XTdoqJiDVLEVYUTfqxE9H7qc0DuJUTdfgXsFXFOLMKieWR_bZiN-jAUTLrbN4AjPeYF-IwSDko5aiTChqGQQbPhdWk7__k8CFf91KQv7rXicNjHnORQ74SWcUtJJMxY-p_nvBSTSyMr9g0RmlFsPnA_8o3ZI2K1v_cY5nnR0FHOVr95sqKBCCxC-WUuftXTmA-tvOhTDiRTIsRAKJuV7MF3-bNVG7k5j9cTdqO3VrL-CRpv9mK8SVVPxaeeg',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Audio Interface',
    seller: 'SoundGear HQ',
    price: 25000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcQFONTeth1n9SVG2HDP6K2VdA04oRURkLB8kdv-NYCtprtRRq5Gfw0ylTS0NXPXWsfIrjmXEJ_FD8SziVd1f_i_yi--WdLzy7WstU1W9NxdC0Qit83oKS4MX70KzxeW4ssaqX6tK45l8HWYwmb2c5qsZT7AKNXBc7V1ldwhDpV2odJLze-mCR981ZpsSNnb1o92oqzQHJMMaVU8x5SVuV7PAgSw8BOxcSkWNdNNV7jN6pCTojrDXpXmtZlBFzKIwIIE8auK5aG-E',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Streetwear Cap',
    seller: 'Lagos Threads Co.',
    price: 3500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOLiUUYH8rhyvHruWQ5qNAxD3E7ap5R7jKvKuBZiFKb6KVHvlBMC1C-Fj9LZQ-a_1MVDtyIIFkwkThDy885xLgFME-3S9MuLExPVx6NMh02uzFI9Ab-Bdr5Rpv3CNbkgLAr7RltNhRo-Z3odWT64yNyZLSU-h-u0wDBO8d3VOZWvtNBhIrWjuokIpY2x4-03muDi9zF-gU73Pq15A3btcFWZ8Tc2VUpGR3auSE5DogyhqLmEbyQCrjYGZieRoxmFX5WDGtOPrD0Lw',
    rating: 4.3,
  },
  {
    id: 6,
    name: 'Studio Monitor Speakers',
    seller: 'SoundGear HQ',
    price: 45000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPAtOJ9YLCzqFoUf0Pb4YFux7j9Fy4pRo-xbdjP4-pUp84ly_5jOqGn_UpDx3GrX2WFhW6UQGnOgTjofthlUHfRoGOeYknc-D5zk-XL0eFDy5Xgrg40lJ3E2C4afs2uNKM1RAO1Nce-rRhEtxX6-D8nPDMSzuDUCAxE6HKItz-V40BnSn_m0t8kGVRCRgThQyv2B1bjb_epT7BXVRvgObZY-cdUS_HPZ59jxpqFN3E4hY2NcVXzdsgYThKaMjCzwaeMpg__ZH0-tE',
    rating: 5.0,
  },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="space-y-gutter">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">Marketplace</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Discover products from verified CMPapp creators and partners. Earn cashback on every purchase.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface placeholder-on-surface-variant rounded-xl pl-14 pr-6 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-sm"
          placeholder="Search products, stores..."
          type="text"
        />
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-full font-label-caps text-label-caps whitespace-nowrap transition-colors ${
              category === activeCategory
                ? 'bg-secondary-container text-on-secondary-container border-2 border-transparent shadow-sm'
                : 'bg-surface-alt text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="bg-primary-container rounded-xl p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-secondary text-primary font-label-caps text-label-caps rounded-full mb-3">HOT DEAL</span>
            <h3 className="font-h3 text-h3 text-on-primary mb-2">Lagos Threads Co.</h3>
            <p className="font-body-md text-on-primary-container">Premium streetwear and accessories. Earn 5% cashback.</p>
          </div>
          <button className="bg-secondary-container text-on-secondary-container font-body-md font-semibold px-6 py-3 rounded-lg hover:bg-secondary transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {products.map((product) => (
          <div key={product.id} className="bg-surface-alt rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
            <div className="relative aspect-square overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={product.name}
                src={product.image}
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-body-md text-body-md font-semibold text-on-background mb-1">{product.name}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{product.seller}</p>
              <div className="flex items-center justify-between">
                <span className="font-data-lg text-data-lg text-primary">₦{product.price.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-data-md text-data-md text-on-surface-variant">{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}