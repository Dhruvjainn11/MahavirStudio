import { useClientProducts } from '@/app/hooks/useClientProducts';
import Image from 'next/image';

export default function Products() {
  const { data, isLoading } = useClientProducts();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.products.map(product => (
        <div key={product._id} className="border p-4 rounded">
          <Image src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.price}</p>
          {/* add more as needed */}
        </div>
      ))}
    </div>
  );
}
