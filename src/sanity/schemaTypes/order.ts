import { Rule } from 'sanity'

const order = {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'customer_name',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'customer_email',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'customer_phone',
      title: 'Customer Phone',
      type: 'string',
    },
    {
      name: 'whatsapp_number',
      title: 'WhatsApp Number',
      type: 'string',
    },
    {
      name: 'shipping_address',
      title: 'Shipping Address',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
    },
    {
      name: 'zip_code',
      title: 'Zip Code',
      type: 'string',
    },
    {
      name: 'total_amount',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'orderItem' }],
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'created_at',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
      },
      initialValue: () => new Date().toISOString(),
    },
  ],
}

export default order

