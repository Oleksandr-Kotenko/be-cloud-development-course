export interface ProductInterface extends StockInterface {
  id: string;
  title: string;
  description: string;
  price: number;
  logo: string;
}

export interface StockInterface {
  product_id: string;
  count: number;
}

export interface ProductServiceInterface {
  getProductById: (productId: string) => Promise<ProductInterface>;
  getStockByProductId: (id: string) => Promise<StockInterface>;
  getAllProducts: () => Promise<ProductInterface[]>;
  getAllStocks: () => Promise<StockInterface[]>;
  create: (product: Omit<ProductInterface, 'count'>) => Promise<ProductInterface>;
  createStock: (product: StockInterface) => Promise<StockInterface>;
}
