import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";

import { getImportProductsFile } from "../src/handlers/importProductsFile";

describe("importProductsFile lambda handler", () => {
  test("should return mocked signed url", async () => {
    const expectedResult = "signedUrl";

    AWSMock.mock("S3", "getSignedUrl", expectedResult as any);

    const s3 = new AWS.S3({ region: "eu-west-1" });

    const importProductsFile = getImportProductsFile({
      s3,
    });
    const { body, statusCode }: any = await importProductsFile({
      queryStringParameters: { name: "products" },
    });

    expect(JSON.parse(body)).toEqual(expectedResult);
    expect(JSON.parse(statusCode)).toEqual(200);
  });
});
