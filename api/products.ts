import { PRODUCTS } from '../src/data/products';

export default function handler(_req: any, res: any) {
  res.json(PRODUCTS);
}
