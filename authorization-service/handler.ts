import * as handlers from "./src";
import { winstonLogger as logger } from "./src/helpers/winstonLogger";

export const basicAuthorizer = handlers.basicAuthorizer({logger});
