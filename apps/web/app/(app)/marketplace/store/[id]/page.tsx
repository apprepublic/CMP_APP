import Link from 'next/link';

export function generateStaticParams() {
  return [{ id: 'example-store' }];
}

export default function StorefrontPage({ params }: { params: { id: string } }) {
  // Mock data for the store
  const store = {
    name: 'Lagos Threads Co.',
    category: 'Fashion & Apparel',
    rating: 4.8,
    reviews: 124,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB48A-uZeJMsW_IaxzGFmeaoCjmCnYgfHoICi9KxLvqWa6T26r7HZn6vg0hyqRbgqfl54UxjhiYwUaGJUdpidrkhjL4C_T9F8_Kq73-RtnmXc3Rhv6iZOYOUHhRoPkEcZPxcwF4crZsCxGTn-w8gngRxddRqk-72Ayfo91p6PMvhHRyge4NbGTe0IAk3paru3Fo2Y56PFLo30Z0bzYpCJKtQ_f-EIWVKZjK9Hohi-ITjhVWHsb1f0k21KdAC4E8jOumePN9lOMmW94',
  };

  return (
    <div className="flex flex-col space-y-12 pb-12">
      {/* Store Header Banner */}
      <section className="relative bg-primary-container w-full h-[256px] min-h-[200px] flex items-end p-gutter md:p-margin-desktop overflow-hidden rounded-xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
        <div className="relative z-10 w-full flex items-end gap-6">
          {/* Store Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-surface-alt border-4 border-surface shadow-md overflow-hidden flex-shrink-0 relative">
            <img alt="Lagos Threads Co. Logo" className="w-full h-full object-cover" src={store.logo} />
          </div>
          {/* Store Info */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary">{store.name}</h1>
              <span className="material-symbols-outlined text-[#1DA1F2] bg-white rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}>verified</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-primary-fixed-dim font-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">checkroom</span> {store.category}
              </span>
              <span className="flex items-center gap-1 text-[#fdc34d]">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {store.rating} ({store.reviews} Reviews)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Store Content */}
      <div className="space-y-12">
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
            <div className="md:col-span-2 relative rounded-xl overflow-hidden border-2 border-[#B8860B] shadow-[0_0_10px_rgba(184,134,11,0.3)] bg-surface-alt h-[400px] group">
              <img alt="Featured Product" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtGXhc26SMEih4y1YVe1GWtqCUkGfNc8GGDhv9d6wOX0UPfWZwbxpB2Lzx8J2TlTLP2jjaQMhic-Wq5smD0n21omHezdXCKYrZkMcReuPzq_Ahu8PuZu1ED2sqHcgoq42VV3U85DTAA9PM4GJzxmnXxQa2ZYQY5vT1sctSB1zGJpY7iZJ53gML9fpsbeZT_1pm8e7DLVkzTeS0EBaOzQt9seCYL5Azesgv2OTdeHhi83L68BXk8JAxCFT91GF-EcCB7FcnzAtjYdk" />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <span className="inline-block px-3 py-1 bg-[#B8860B] text-primary font-label-caps text-label-caps rounded-full mb-3 uppercase">Boosted</span>
                <h3 className="font-h3 text-h3 text-white mb-2">The Oga Heritage Agbada</h3>
                <div className="flex items-baseline gap-4">
                  <span className="font-data-lg text-data-lg text-[#fdc34d]">₦85,000</span>
                  <span className="font-data-md text-data-md text-white/70">🪙 8,500,000</span>
                </div>
              </div>
            </div>

            {/* Featured Secondary Cards */}
            <div className="flex flex-col gap-6">
              <div className="relative rounded-xl overflow-hidden bg-surface-alt h-[188px] group">
                <img alt="Accessories" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASGUe5Rd7_d5UvGMdQoD-fv_z-arnnjiYj7w7DEIRGfwiJCrRkgQayRkoWaYpyqCfFNS9CZfTc_WQRXFmw1S9kFvoGlZsz0ERCQ4KdyhnOn92om0OkUtQFnuTIe1OFODO3PMLX7GqQnHphoDnl074QB8kF9sQhuUMxZZ6CZzzNdEIHO5fXIjRicKkfsetmiDtgV866rqB3n1IuSqT3mQIG2Vg6ptj51cHSTFzj7-AXLsV9qpgdZCuXpgzFiJJWkn-QcLFNqY074ZI" />
                <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-body-lg text-body-lg text-white font-medium">Lagos Nights Wristwear</h4>
                  <span className="font-data-md text-data-md text-[#fdc34d]">₦15,000</span>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-surface-alt h-[188px] group">
                <img alt="Casual Wear" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDf0FESmUmwQNaRWBL8YZOFwcIxhB4LRIgobt7Pmz8rQAq0pyjE7fn9gqfhDW3-40ITmQF09nxSKz2xt4oiXELoxa2DeucG_w4BHq9dlLjAQ-k5A_b4i3fmYrPh2-rye5lJin9F6h529f5JooRHwShGLp4MmWFx8zXOFZp9Ee34gupNjCxUeGFO6HY8t7EP6WPpI8v9bGdkWhmTuYp2be7jGm7sK1ew_FQWvnKXeHrcactF-sUFPzoHdX95R9oYyIppWI2hIhS56c" />
                <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-body-lg text-body-lg text-white font-medium">Mainland Essential Tee</h4>
                  <span className="font-data-md text-data-md text-[#fdc34d]">₦12,500</span>
                </div>
              </div>
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
            {/* Product Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col">
              <div className="aspect-square relative overflow-hidden bg-surface-alt">
                <img alt="Product Image" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ-zvDXbetKNZM3guQybU5np0KVMsRdC_zDevKv8A7t56Sj0fkp8hIQ-ZW2HwGKHbOSvR5HCmCmU29vLIv6OzPJ6CHrY3G-1pBwuoXIzk8FMzunxqbAepjSNAn9kiXh681W1Pu_I20Dr_1VV5jwwa1_0Fb0DU5SbYDltAM-oyXjrEsQJOa1GoHoK03m-0lcQ9YEeqSphJHDBJj1VKo3SzvI6qHi6leiGTCCIASafWQn9L3zXdg0HjCookq_BMwfrjsJb4ysGApCrc" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-body-md text-body-md text-on-surface font-medium line-clamp-2 mb-2">Tailored Executive Trousers - Charcoal</h3>
                <div className="mt-auto">
                  <div className="font-data-lg text-data-lg text-on-surface mb-1">₦25,000</div>
                  <div className="flex items-center gap-1 font-data-md text-data-md text-on-surface-variant mb-4">
                    <span className="material-symbols-outlined text-[14px] text-[#B8860B]">toll</span>
                    2,500,000 Coins
                  </div>
                  <button className="w-full bg-[#B8860B] text-primary hover:bg-[#8B6914] py-2 rounded-lg font-body-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">chat</span> Inquire
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col">
              <div className="aspect-square relative overflow-hidden bg-surface-alt">
                <img alt="Product Image" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUr4j2yF1ld4kxokYssK3xlsS7z1Gl_GqSET2iLWa-bXPI2JJeTwUrt5KKMmdVTqBzcuOB4-HacHB1VVpeA6_WIdAm0rnCi07PQYtFuC4FXxFr9IzzIExIELJKD0RIIWGkqlkj7iaT-1Jb-PDRc6ey5n9oP0mikI2DpgkiXS3q8h-Js1ERuDSDh4stRK9kRaE5VJHDweCHS8mrh4il98WlGNpxJIaIpO0Yuqfgu5eC8AowiW6Shsql-DO-4-sK5E9-0dqnzL5vtrw" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-body-md text-body-md text-on-surface font-medium line-clamp-2 mb-2">Artisan Leather Loafers</h3>
                <div className="mt-auto">
                  <div className="font-data-lg text-data-lg text-on-surface mb-1">₦42,000</div>
                  <div className="flex items-center gap-1 font-data-md text-data-md text-on-surface-variant mb-4">
                    <span className="material-symbols-outlined text-[14px] text-[#B8860B]">toll</span>
                    4,200,000 Coins
                  </div>
                  <button className="w-full bg-[#B8860B] text-primary hover:bg-[#8B6914] py-2 rounded-lg font-body-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">chat</span> Inquire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
