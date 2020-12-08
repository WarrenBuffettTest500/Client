const concatRealPrice = async staticPortfolio => {
  return await Promise.all(
    staticPortfolio.map(async originalItem => {
      const item = JSON.parse(JSON.stringify(originalItem));

      const priceResponse = await fetch(`https://twelve-data1.p.rapidapi.com/price?symbol=${item.symbol}&outputsize=30&format=json`, {
        'method': 'GET',
        'headers': {
          'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
          'x-rapidapi-host': 'twelve-data1.p.rapidapi.com',
        },
      });

      const { price } = await priceResponse.json();

      item.price = price;

      return item;
    }),
  );
};

export default concatRealPrice;
