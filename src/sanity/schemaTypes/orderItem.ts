import { Rule } from 'sanity'

const orderItem = {
  name: 'orderItem',
  title: 'Order Item',
  type: 'object',
  fields: [
    {
      name: 'product_id',
      title: 'Product ID',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'product_name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'product_slug',
      title: 'Product Slug',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'product_image',
      title: 'Product Image',
      type: 'url',
    },
    {
      name: 'price_at_purchase',
      title: 'Price at Purchase',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(1),
    },
  ],
}

export default orderItem

