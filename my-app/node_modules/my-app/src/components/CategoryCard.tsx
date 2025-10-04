import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  itemCount?: number; // Made optional as it's not used directly in rendering
  icon?: string; // Made optional as it's not used directly in rendering
}

const CategoryCard = ({ title, description, image, href }: CategoryCardProps) => {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-24 sm:h-48 lg:h-56 overflow-hidden">
          {/* Background Image */}
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-5 lg:p-6 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
              {title}
            </h3>
          </div>
          
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 mb-2 line-clamp-2 flex-1">
            {description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs sm:text-base lg:text-lg text-amber-600 font-semibold group-hover:text-amber-700 transition-colors duration-300">
              View Collection →
            </span>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-200 rounded-full group-hover:bg-amber-400 transition-colors duration-300"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
