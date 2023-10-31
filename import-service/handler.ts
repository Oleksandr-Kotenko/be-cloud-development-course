import AWS from "aws-sdk";
import * as handlers from "./src";
import { winstonLogger as logger } from "./src/utils/winstonLogger";

const s3 = new AWS.S3({ region: "us-east-1" });
const sqs = new AWS.SQS();

export const importFileParser = handlers.getImportFileParser({
  s3,
  logger,
  sqs,
});

export const importProductsFile = handlers.getImportProductsFile({
  s3,
});
