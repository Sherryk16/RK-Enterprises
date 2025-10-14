'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import { urlForImage } from '@/sanity/lib/image';
import { SanityProduct } from '@/lib/products';

interface AddToCartButtonProps {
  product: SanityProduct;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ? urlForImage(product.images[0]).url() : "/placeholder-product.jpg",
      slug: product.slug,
      quantity: 1,
    });
    showToast(`${product.name} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-8 w-full md:w-auto bg-amber-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-amber-700 transition-colors duration-200"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;









