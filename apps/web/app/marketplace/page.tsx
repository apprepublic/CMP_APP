'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatNumber } from '@/lib/utils';
import { Search, ShoppingBag, MapPin, MessageCircle, Loader2, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  priceNaira: number;
  coinPrice: number;
  imageUrls: string[];
  category: string;
  isFeatured: boolean;
  business: {
    id: string;
    businessName: string;
    avatarUrl: string | null;
    isVerified: boolean;
    location: string | null;
    rating: number;
  };
}

interface Category {
  name: string;
  slug: string;
  icon: string | null;
  children?: Category[];
}

export default function MarketplacePage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(1, 20),
        api.getCategories(),
      ]);
      setProducts(productsData.products);
      setCategories(categoriesData.categories);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = (product: Product) => {
    if (product.business.whatsappNumber) {
      window.open(`https://wa.me/${product.business.whatsappNumber.replace(/\+/g, '')}`, '_blank');
    } else {
      toast({
        title: 'Contact not available',
        description: 'This seller has not added a WhatsApp number',
      });
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.business.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="mt-2 text-muted-foreground">
          Discover products from verified businesses
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.slug}
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-lg border bg-card overflow-hidden"
            >
              <div className="aspect-square bg-muted relative">
                {product.imageUrls[0] ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
                    FEATURED
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {product.business.businessName}
                  {product.business.isVerified && ' ✓'}
                </p>

                {product.business.location && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.business.location}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold">₦{product.priceNaira.toLocaleString('en-NG')}</p>
                    <p className="text-xs text-yellow-600">
                      or {formatNumber(product.coinPrice)} coins
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="mt-3 w-full"
                  variant="outline"
                  onClick={() => handleContactSeller(product)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try a different search term' : 'Check back later for new products'}
          </p>
        </div>
      )}

      {/* Sell CTA */}
      <div className="mt-12 rounded-lg border bg-muted p-6 text-center">
        <h3 className="text-xl font-semibold">Start Selling</h3>
        <p className="mt-2 text-muted-foreground">
          Create a business profile and list your products on CMPapp
        </p>
        <Button className="mt-4">
          Create Store
        </Button>
      </div>
    </div>
  );
}