import { NextResponse } from 'next/server';
import { sanityWriteClient } from '@/sanity/lib/client'; // Import sanityWriteClient
import { OrderItemInput } from '@/lib/orders'; // Re-using existing types for consistency

export async function POST(req: Request) {
  try {
    const { customer_name, customer_email, customer_phone, whatsapp_number, shipping_address, city, zip_code, total_amount, items, status = 'pending' } = await req.json();

    // Basic validation
    if (!customer_name || !customer_email || !shipping_address || !total_amount || !items || items.length === 0 || !status) {
      return NextResponse.json({ message: 'Missing required order fields.' }, { status: 400 });
    }

    // Prepare order items for Sanity (nested in the order document)
    const orderItems = items.map((item: OrderItemInput) => ({
      _type: 'orderItem',
      product_id: item.product_id,
      product_name: item.product_name,
      product_slug: item.product_slug,
      product_image: item.product_image,
      price_at_purchase: item.price_at_purchase,
      quantity: item.quantity,
    }));

    const newOrder = {
      _type: 'order',
      customer_name,
      customer_email,
      customer_phone,
      whatsapp_number, // Add whatsapp_number to newOrder
      shipping_address,
      city,
      zip_code,
      total_amount,
      items: orderItems,
      created_at: new Date().toISOString(),
      status, // Add status to newOrder
    };

    console.log('Attempting to create new order in Sanity:', JSON.stringify(newOrder, null, 2));
    const result = await sanityWriteClient.create(newOrder);
    console.log('Sanity order creation successful:', JSON.stringify(result, null, 2));

    return NextResponse.json({ message: 'Order placed successfully!', orderId: result._id }, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ message: 'Failed to place order.', error: (error as Error).message }, { status: 500 });
  }
}
