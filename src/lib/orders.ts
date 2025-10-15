import { sanityClient } from "@/sanity/lib/client"; // Import sanityClient

export interface OrderItemInput {
  product_id: string;
  product_name: string;
  product_slug: string; // Add product_slug to OrderItemInput
  product_image?: string; // Add product_image to OrderItemInput
  price_at_purchase: number; // Add price_at_purchase to OrderItemInput
  quantity: number;
}

export interface OrderInput {
  customer_name: string;
  whatsapp_number?: string; // Add whatsapp_number to OrderInput
  total_amount: number;
  items: OrderItemInput[];
}

export interface OrderResponse {
  order: {
    id: string;
  };
  items: OrderItemInput[];
}

export async function createOrder(orderData: OrderInput): Promise<OrderResponse> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to place order');
    }

    const result = await response.json();
    return { order: { id: result.orderId }, items: orderData.items }; // Assuming API returns orderId
  } catch (error) {
    console.error('Error in createOrder (client-side):', error);
    throw error; // Re-throw to be caught by the calling component
  }
}

export interface SanityOrderItem {
  _key: string;
  _type: 'orderItem';
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image?: string;
  price_at_purchase: number;
  quantity: number;
}

export interface SanityOrder {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  whatsapp_number?: string; // Add whatsapp_number to SanityOrder
  shipping_address: string;
  city?: string;
  zip_code?: string;
  total_amount: number;
  items: SanityOrderItem[];
  created_at: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Add status to SanityOrder
}

export async function getAllOrders(): Promise<SanityOrder[]> {
  const query = `*[_type == "order"] | order(created_at desc) {
    _id,
    _createdAt,
    _updatedAt,
    customer_name,
    customer_email,
    customer_phone,
    whatsapp_number,
    shipping_address,
    city,
    zip_code,
    total_amount,
    created_at,
    status,
    items[]{
      _key,
      _type,
      product_id,
      product_name,
      product_slug,
      product_image,
      price_at_purchase,
      quantity
    }
  }`;

  try {
    const orders = await sanityClient.fetch<SanityOrder[]>(query);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}