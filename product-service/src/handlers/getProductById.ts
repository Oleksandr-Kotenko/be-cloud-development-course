import { ProductServiceInterface } from '../services/products';
import { winstonLogger } from '../utils/winstonLogger';
import { errorResponse, successResponse } from '../utils/apiResponseBuilder';

export const getProductByIdHandler = (productService: ProductServiceInterface) => async (event, _context) => {
  try {
    winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

    const { productId = '' } = event.pathParameters;

    if (!productId) {
      winstonLogger.logError('Product ID is missing or invalid.');
      return successResponse({ message: 'Product ID is missing or invalid.' }, 404);
    }

    const product = await productService.getProductById(productId);
    winstonLogger.logRequest(`"Received product with id: ${productId}: ${JSON.stringify(product)}`);

    if (!product) {
      return successResponse({ message: 'Product not found!!!' }, 404);
    }

    const stock = await productService.getStockByProductId(productId);
    return successResponse({
      count: stock.count || 0,
      ...product,
    });
  } catch (err) {
    winstonLogger.logError(`Error: ${err.stack}`);
    return errorResponse(err);
  }
};
