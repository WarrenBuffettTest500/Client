import { Decimal } from 'decimal.js';

const calculateTotal = portfolio => {
  let total = 0;

  portfolio.forEach(item => {
    total += Number(new Decimal(item.price || item.avgPrice).times(new Decimal(item.quantity)).toDecimalPlaces(2));
  });

  return total;
};

export default calculateTotal;
