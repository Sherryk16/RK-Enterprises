import { supabase } from './supabase';

export interface OrderItemInput {
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image?: string;
  price_at_purchase: number;
  quantity: number;
}

export interface OrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  city?: string;
  zip_code?: string;
  total_amount: number;
  items: OrderItemInput[];
}

export async function createOrder(orderData: OrderInput) {
  const { items, ...orderHeader } = orderData;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderHeader)
    .select('id')
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  if (!order) {
    throw new Error('Failed to retrieve order ID after creation.');
  }

  const orderItems = items.map(item => ({ ...item, order_id: order.id }));

  const { data: createdItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select('*');

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw itemsError;
  }

  return { order, items: createdItems };
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data;
}










