import { Box, Drill, HardHat, Package, Smartphone, Shield, Hand } from 'lucide-react';

const artIcons = {
  phone: Smartphone,
  drill: Drill,
  boot: Shield,
  helmet: HardHat,
  gloves: Hand,
  package: Package,
};

const ProductArt = ({ product, className = '' }) => {
  const Icon = artIcons[product.icon] || Box;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${product.tone} ${className}`}>
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/20" />
      <div className="absolute -bottom-14 -left-10 h-48 w-48 rounded-full border border-white/20" />
      <Icon aria-hidden="true" className="relative z-10 h-24 w-24 text-white/90 drop-shadow-lg sm:h-28 sm:w-28" strokeWidth={1.25} />
    </div>
  );
};

export default ProductArt;
