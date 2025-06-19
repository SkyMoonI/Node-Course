module.exports = (cardTemplate, productData) => {
  let output = cardTemplate.replace(
    /{%PRODUCTNAME%}/g,
    productData.productName
  );
  output = output.replace(/{%IMAGE%}/g, productData.image);
  output = output.replace(/{%PRICE%}/g, productData.price);
  output = output.replace(/{%FROM%}/g, productData.from);
  output = output.replace(/{%NUTRIENTS%}/g, productData.nutrients);
  output = output.replace(/{%QUANTITY%}/g, productData.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, productData.description);
  output = output.replace(/{%ID%}/g, productData.id);
  if (!productData.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};
