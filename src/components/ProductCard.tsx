import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  name: string;
  weight: string;
  price: string;
  imageUrl: string;
  onAddToCart: () => void;
}

export function ProductCard({ name, weight, price, imageUrl, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-gray-900 mb-2">{name}</h3>
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">{weight}</span>
          <span className="text-orange-600">{price}</span>
        </div>
        <Button 
          onClick={onAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
