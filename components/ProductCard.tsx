import React from 'react';
import { Product } from '../types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden group">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-brand-dark shadow-sm">
          {product.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold font-display text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4 flex-grow">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-brand-blue">{product.price} <span className="text-sm font-normal text-gray-400">{product.currency}</span></span>
          <Button 
            variant="secondary" 
            onClick={() => onAddToCart(product)}
            className="text-sm px-4 py-1"
          >
            Add +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;