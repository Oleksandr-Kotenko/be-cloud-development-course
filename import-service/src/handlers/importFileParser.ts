import csv from "csv-parser";

export const getImportFileParser =
  ({ s3, logger }) =>
  async (event) => {
    logger.logRequest(`Incoming event - ${JSON.stringify(event)}`);

    for (const record of event.Records) {
      await new Promise((resolve, reject) => {
        const s3Stream = s3
          .getObject({
            Bucket: "be-product-import-dev",
            Key: record.s3.object.key,
          })
          .createReadStream();

        s3Stream
          .pipe(csv())
          .on("data", (data) => {
            logger.logRequest(`Data - ${JSON.stringify(data)}`);
          })
          .on("end", async () => {
            logger.logRequest(
              `Copy from be-product-import-dev/${record.s3.object.key}`,
            );

            await s3
              .copyObject({
                Bucket: "be-product-import-dev",
                CopySource: `be-product-import-dev/${record.s3.object.key}`,
                Key: record.s3.object.key.replace("uploaded", "parsed"),
              })
              .promise();

            logger.logRequest(
              `Copied into be-product-import-dev/${record.s3.object.key.replace(
                "uploaded",
                "parsed",
              )}`,
            );

            await s3.deleteObject({
              Bucket: "be-product-import-dev",
              Key: record.s3.object.key,
            });

            logger.logRequest(`Deleted from be-product-import-dev/uploaded`);
            resolve();
          })
          .on("error", (err) => {
            logger.logError(JSON.stringify(err));
            reject();
          });
      });
    }
  };
