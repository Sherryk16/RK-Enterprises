import { type SchemaTypeDefinition } from 'sanity'

import product from './product';
import category from './category';
import subcategory from './subcategory';
import order from './order';
import orderItem from './orderItem';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, subcategory, order, orderItem],
};
