'use client';

import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    slug: string;
  };
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder-product.jpg",
      slug: product.slug,
      quantity: 1,
    });
    alert(`${product.name} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex-1 bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-700 transition-colors duration-300"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;






