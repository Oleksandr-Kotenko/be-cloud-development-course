import { ProductInterface, ProductServiceInterface, StockInterface } from '../services/products';
import { winstonLogger } from '../utils/winstonLogger';
import { errorResponse, successResponse } from '../utils/apiResponseBuilder';

export const getAllProductsHandler = (productService: ProductServiceInterface) => async (event, _context) => {
  try {
    winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

    const products: ProductInterface[] = await productService.getAllProducts();
    const stocks: StockInterface[] = await productService.getAllStocks();

    const result: ProductInterface[] = products.map((product) => {
      const stock = stocks.find((st) => st.product_id === product.id);
      return {
        count: stock.count || 0,
        ...product,
      };
    });

    winstonLogger.logRequest(`"Received products: ${JSON.stringify(result)}`);

    return successResponse(result);
  } catch (err) {
    return errorResponse(err);
  }
};
