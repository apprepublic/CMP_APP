'use client';

import Link from 'next/link';

const store = {
  name: 'Lagos Threads',
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt27hFeTQVgVNv07rzpdkMhRFDQye7NsmbXqB75YViH8WZIUc0YofRECEHwJ54eBn_n4SCuRd-zgHX_yPHAz0MQ1Phl1bCgeerSjaLEnSCQZLZvJhAx9qt0TjGib7QBi7IaEtdaeyOxSOKbiU15ew9_8Y0nPbKEwleiYfrpuxszBQNuqFbsrmeN-LclNCVPB6mnE-1j9-E3fVneV_GnJOQ3nqXi4WngP7B6MLS4vP9EN9zeUdUB7Dv7c_Ge5v8F1amf93CI4wLK5WR',
  category: 'Fashion & Apparel',
  rating: 4.9,
  reviewCount: 234,
  verified: true,
};

const featuredProducts = [
  { id: 'fp1', name: 'Ankara Deluxe Set', price: 25000, coins: 250, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLpYMhKyUa3sYfjFwarbRZOAgcB7gxZ5UAftIvcxhLD7heSc8Kky1bvKl9y3QwQToZ7Hyo1U2Pm451bDN15__5P8JArXLALuKP1XypuIT8j8hzfeYaLPO2r_XojOLNOD9z9BB3S_muGDdH5-EtKZfsvDkITMChSw8ovuykCltnOXCXIbJMADsByFMcRKCO9f_napkWXv9NPxnHsoMAe3QFUhtGUCv2UU_UG1nUHeB3DF1x-FNz6krDG7na8XgFrFhBm6OZ9841xZaQ' },
  { id: 'fp2', name: 'Adire Wrap Dress', price: 18000, coins: 180, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpiga3eNOVP8yXBmlTNQD-8rvLmmwEikDjZAWVzH-KFiNYtQPsXf_58t9SDDhgXjRA5aY6W_O6siz5Aenybsd59MVJMOfSCwNSVWK_lR7WLrbWVvO6DRmtTwUhJ_fG6shEvUUbqFYZjvXdpj_yt6RXOmpqfjkmGilqacpa3K-jHTsQFrSmcmIvjuU-HpJ3XON77d0wtkyEz-g3w8VJzDt8cpS-0442OCncJFJMzeNwMHa81VM-8KNTy-CaUme_QEjvQ4eAMVcRRn0' },
  { id: 'fp3', name: 'Gele Headpiece', price: 8500, coins: 85, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqkXT-8nTiFDgN-EPzsYxJc5xTladBCv9aJ-3nBZW3h8SlgZ7CzLq8lG-QyrU_GIIwa-aA-yG97Ux5LqSkEmuczKhqqe5vjBb3gdznHNOCHW2OVOFO172T_rOkAPy9RQ67azHCIjBanfO7Q2aeT-1OjmFX82-iOQbkyja9BwYkVRPh6huHB3veUqMzZgp9SpAuiDFGwhWHxYBdkWJ20vneKSjSpqUj5v9VDO_KAf2IHBJdq1kWS-MmbfpTeuJB8Py1JbstbzjjCps' },
];

const products = [
  { id: 'p1', name: 'Dashiki Classic', price: 12000, coins: 120, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgaAYWsJ0U0tL27v8tcN5JaA3LkaKugrFW32u-0v9LdNNgPfykbMtqMjiqm2hUklepZHlEd_KLhbsoDbgJ2hyw8gGgmsEsVCQPsc3E6CkkpkGUEtkdKqi2dqBqKQUz5wPyj_6jQuVZ0WsBS5ZM5U6NUntnfXGV-1ofKGWWOlrhn1mPPnyWWVjmkWbTopnQuFYGpXEKuhk-AQMFyLJeUAUP2KcshuPOXepDytpZFQepqsvJBfmo1fCSA1dTIjZ6b4-hHrSKVo_KeCQ' },
  { id: 'p2', name: 'Agbada Royal', price: 45000, coins: 450, image: '' },
  { id: 'p3', name: 'Buba & Sokoto', price: 22000, coins: 220, image: '' },
  { id: 'p4', name: 'Iro & Buba Set', price: 28000, coins: 280, image: '' },
];

export default function StorefrontClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Store Header Banner */}
      <section className="relative bg-primary-container w-full h-[256px] min-h-[200px] flex items-end p-gutter md:p-gutter overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundColor: '#0d1b35' }}></div>

        <div className="relative z-10 w-full max-w-container-max mx-auto flex items-end gap-6">
          {/* Store Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-surface-alt border-4 border-surface shadow-md overflow-hidden flex-shrink-0">
            <img className="w-full h-full object-cover" src={store.logo} alt={store.name} />
          </div>

          {/* Store Info */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary">{store.name}</h1>
              {store.verified && (
                <span className="material-symbols-outlined text-[#1DA1F2] bg-white rounded-full p-0.5" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>verified</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-primary-fixed-dim font-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">checkroom</span>
                {store.category}
              </span>
              <span className="flex items-center gap-1 text-[#fdc34d]">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {store.rating} ({store.reviewCount} Reviews)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Store Content */}
      <div className="max-w-container-max mx-auto p-margin-mobile md:p-gutter space-y-12">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-surface-variant">
          <div className="flex gap-2">
            <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-body-md font-medium hover:bg-inverse-surface transition-colors">
              Message Seller
            </button>
            <button className="bg-surface-alt text-on-surface-variant px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-dim transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>

        {/* Featured / Boosted Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-secondary-container">local_fire_department</span>
            <h2 className="font-h3 text-h3 text-on-surface">Featured Collection</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Main Card */}
            <div className="md:col-span-2 relative rounded-xl overflow-hidden bg-surface-alt h-[400px] group border-2 border-[#B8860B] shadow-[0_0_10px_rgba(184,134,11,0.3)]">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={featuredProducts[0].image} alt={featuredProducts[0].name} />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <span className="inline-block px-3 py-1 bg-[#B8860B] text-primary font-label-caps text-label-caps rounded-full mb-3 uppercase">Boosted</span>
                <h3 className="font-h3 text-h3 text-white mb-2">{featuredProducts[0].name}</h3>
                <div className="flex items-baseline gap-4">
                  <span className="font-data-lg text-data-lg text-[#fdc34d]">₦{featuredProducts[0].price.toLocaleString()}</span>
                  <span className="font-data-md text-data-md text-white/70">🪙 {featuredProducts[0].coins.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Featured Secondary Cards */}
            <div className="flex flex-col gap-6">
              {featuredProducts.slice(1).map((product) => (
                <div key={product.id} className="relative rounded-xl overflow-hidden bg-surface-alt h-[188px] group">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
                  <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="font-body-lg text-body-lg text-white font-medium">{product.name}</h4>
                    <span className="font-data-md text-data-md text-[#fdc34d]">₦{product.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-h3 text-h3 text-on-surface">All Products</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-dim transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...featuredProducts, ...products].map((product) => (
              <div key={product.id} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col">
                <div className="aspect-square relative overflow-hidden bg-surface-alt">
                  <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-body-md text-body-md text-on-surface font-medium line-clamp-2 mb-2">{product.name}</h3>
                  <div className="mt-auto">
                    <div className="font-data-lg text-data-lg text-on-surface mb-1">₦{product.price.toLocaleString()}</div>
                    <div className="flex items-center gap-1 font-data-md text-data-md text-on-surface-variant mb-4">
                      <span className="material-symbols-outlined text-[14px] text-[#B8860B]">toll</span>
                      {product.coins.toLocaleString()} Coins
                    </div>
                    <button className="w-full bg-[#B8860B] text-primary hover:bg-[#8B6914] py-2 rounded-lg font-body-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
