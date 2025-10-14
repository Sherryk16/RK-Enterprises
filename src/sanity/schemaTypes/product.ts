import { Rule } from 'sanity'

const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: 'original_price',
      title: 'Original Price',
      type: 'number',
      description: 'Optional original price for sale items',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'detailed_description',
      title: 'Detailed Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
    },
    {
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'is_featured',
      title: 'Is Featured',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_ceo_chair',
      title: 'Is CEO Chair',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_molded',
      title: 'Is Molded',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_gaming_chair',
      title: 'Is Gaming Chair',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_dining_chair',
      title: 'Is Dining Chair',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_visitor_sofa',
      title: 'Is Visitor Sofa',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_study_chair',
      title: 'Is Study Chair',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_outdoor_furniture',
      title: 'Is Outdoor Furniture',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_folding_furniture',
      title: 'Is Folding Furniture',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'show_in_office',
      title: 'Show in Office',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'subcategory',
      title: 'Subcategory',
      type: 'reference',
      to: [{ type: 'subcategory' }],
    },
  ],
}

export default product
