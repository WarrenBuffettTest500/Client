import fetchRealPrice from '../api/fetchRealPrice';

const concatRealPrice = async staticPortfolio => {
  return await Promise.all(
    staticPortfolio.map(async originalItem => {
      const item = JSON.parse(JSON.stringify(originalItem));
      const price = await fetchRealPrice(item.symbol);
      item.price = price;

      return item;
    }),
  );
};

export default concatRealPrice;
