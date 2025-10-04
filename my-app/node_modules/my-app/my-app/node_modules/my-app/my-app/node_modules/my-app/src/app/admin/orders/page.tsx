import AdminLayout from '@/components/admin/AdminLayout';
import { getAllOrders } from '@/lib/orders';
import { format } from 'date-fns';
import Image from 'next/image'; // Import Image component

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  zip_code: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled'; // Assuming these are the possible statuses
  items: OrderItem[];
}

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  let orders: Order[] = [];

  try {
    orders = await getAllOrders();
  } catch (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order: Order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <strong>Name:</strong> {order.customer_name}<br/>
                    <strong>Email:</strong> <a href={`mailto:${order.customer_email}`} className="text-blue-600 hover:underline">{order.customer_email}</a><br/>
                    <strong>Phone:</strong> {order.customer_phone}<br/>
                    <strong>Address:</strong> {order.shipping_address}, {order.city}, {order.zip_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">PKR {order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <ul className="list-disc list-inside space-y-2">
                      {order.items.map((item: OrderItem) => (
                        <li key={item.id} className="flex items-center space-x-2">
                          <Image 
                            src={item.product_image || "/placeholder-product.jpg"}
                            alt={item.product_name}
                            width={32}
                            height={32}
                            className="rounded-md object-cover flex-shrink-0"
                          />
                          <span>{item.product_name} (x{item.quantity}) - PKR {item.price_at_purchase.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
