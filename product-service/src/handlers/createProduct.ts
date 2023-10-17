import { ProductServiceInterface, ProductInterface } from '../services/products';
import { winstonLogger } from '../utils/winstonLogger';
import { errorResponse, successResponse } from '../utils/apiResponseBuilder';
import { v4 as uuidv4 } from 'uuid';

export const createProductHandler = (productService: ProductServiceInterface) => async (event, _context) => {
  try {
    const id = uuidv4();
    winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    const createProductBody = {
      id,
      title: body.title,
      description: body.description,
      price: body.price,
      logo: body.logo,
    };

    const product = await productService.create(createProductBody as ProductInterface);
    winstonLogger.logRequest(`Created product: ${JSON.stringify(product)}`);

    const stock = await productService.createStock({
      count: body.count,
      product_id: id,
    });

    return successResponse({
      ...product,
      count: stock.count,
    });
  } catch (err) {
    winstonLogger.logError(`Error: ${err.stack}`);
    return errorResponse(err);
  }
};
