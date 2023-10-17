const AWS = require('aws-sdk');
const productMock = require('./products-mock.json');

const awsConfig = {
  region: 'eu-west-1',
  profile: 'default',
};

AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

const products = productMock.map((product) => ({
  id: product.id,
  description: product.description,
  price: product.price,
  title: product.title,
  logo: product.logo,
}));

const stocks = productMock.map((product) => ({
  product_id: product.id,
  count: product.count,
}));

function addProducts() {
  products.forEach((product) => {
    const params = {
      TableName: 'Products',
      Item: product,
    };

    docClient.put(params, (err) => {
      if (err) {
        console.error('Error adding product:', err);
      } else {
        console.log('Added product:', product);
      }
    });
  });
}

function addStocks() {
  stocks.forEach((stock) => {
    const params = {
      TableName: 'Stocks',
      Item: stock,
    };

    docClient.put(params, (err) => {
      if (err) {
        console.error('Error adding stock:', err);
      } else {
        console.log('Added stock:', stock);
      }
    });
  });
}

addProducts();
addStocks();
