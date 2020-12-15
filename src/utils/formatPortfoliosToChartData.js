import calculateProportions from './calculateProportions';
import calculateTotal from './calculateTotal';

const formatPortfoliosToChartData = portfolios => {
  const recommendedChartsData = [];

  portfolios.forEach(portfolio => {
    const total = calculateTotal(portfolio.items);

    recommendedChartsData.push({
      owner: portfolio.owner,
      items: calculateProportions(portfolio.items, total),
    });
  });

  return recommendedChartsData;
};

export default formatPortfoliosToChartData;
