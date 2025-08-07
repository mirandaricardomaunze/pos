import type { ProductFormData } from '../../types/product';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: ProductFormData;
  onAddToCart: () => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full border border-gray-100 overflow-hidden">
      {product.imageUrl && (
        <div className="h-56 bg-gray-100 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="text-2xl font-semibold text-indigo-600 mt-3 mb-2">
          {product.sellingPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Estoque: {product.quantity}
        </p>
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={onAddToCart}
          disabled={product.quantity <= 0}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition-colors ${
            product.quantity <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {product.quantity <= 0 ? 'Esgotado' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </div>
  );
};