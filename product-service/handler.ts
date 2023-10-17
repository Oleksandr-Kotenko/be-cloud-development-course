import * as handlers from './src';
import DynamoDBProductService from './src/services/dynamodb-product-service';

const productService = new DynamoDBProductService();

export const getProductById = handlers.getProductByIdHandler(productService);
export const getAllProducts = handlers.getAllProductsHandler(productService);
export const createProduct = handlers.createProductHandler(productService);
