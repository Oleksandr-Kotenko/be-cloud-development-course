import { ProductInterface, ProductServiceInterface } from '../services/products';
import { winstonLogger } from '../utils/winstonLogger';
import { v4 as uuidv4 } from 'uuid';

const sendNotification = async (product: ProductInterface, sns: any) => {
  try {
    await sns
      .publish({
        Subject: 'Products were created',
        Message: JSON.stringify(product),
        MessageAttributes: {
          title: {
            DataType: 'String',
            StringValue: product.title,
          },
          price: {
            DataType: 'Number',
            StringValue: String(product.price),
          },
        },
        TopicArn: process.env.SNS_ARN,
      })
      .promise();

    winstonLogger.logRequest(`SNS notification was sent for ${product.title}`);
  } catch (error) {
    winstonLogger.logError(`Failed to send SNS notification: ${JSON.stringify(error)}`);
  }
};

export const catalogBatchProcessHandler =
  (productService: ProductServiceInterface, sns: any) => async (event: { Records: any }, _context: any) => {
    winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);
    try {
      for (const record of event.Records) {
        const id = uuidv4();
        winstonLogger.logRequest(`Start processing record: ${record.body}`);

        const body = typeof record.body === 'string' ? JSON.parse(record.body) : record.body;

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

        await sendNotification(product, sns);

      }

      return {
        statusCode: 202,
      };
    } catch (err) {
      winstonLogger.logError(`Failed to process batch request: ${err}`);
    }
  };
