import { Decimal } from 'decimal.js';

const calculateProportions = (portfolio, total) => {
  const data = [];

  portfolio.forEach(item => {
    data.push({
      name: item.symbol,
      y: Number(new Decimal(Number(item.price) * Number(item.quantity)).dividedBy(new Decimal(total)).times(100).toDecimalPlaces(2).toString()),
    });
  });

  return data;
};

export default calculateProportions;
