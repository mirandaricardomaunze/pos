import React from 'react';
import type{ProductFormData} from '../../types/product';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductSearchProps {
  products: ProductFormData[];
  onAddToCart: (product: ProductFormData,quantity?: number) => void;
  isLoading: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ products, onAddToCart, isLoading }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search products by name or barcode..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow flex flex-col"
            >
              <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.barcode}</p>
              <div className="mt-2 flex justify-between items-end">
                <span className="text-xs text-gray-400">Stock: {product.quantity}</span>
                <span className="font-bold text-blue-600">${product.sellingPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;