// src/components/ui/ProductArt.jsx
import { Package } from 'lucide-react';

const ProductArt = ({ product, className = '' }) => {
  const imageUrl = product?.imageUrl || product?.image;

  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={imageUrl}
          alt={product?.name || 'Product image'}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-emerald-50 via-slate-100 to-emerald-100 text-emerald-800 ${className}`}
    >
      <div className="flex flex-col items-center p-4 text-center">
        <Package className="h-10 w-10 opacity-75" />
        <span className="mt-2 line-clamp-1 text-xs font-bold uppercase tracking-wider text-emerald-900/70">
          {product?.category || 'TradeSphere'}
        </span>
      </div>
    </div>
  );
};

export default ProductArt;