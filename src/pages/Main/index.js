import React, { useState, useEffect } from 'react';
import './index.scss';
import concatRealPrice from '../../utils/concatRealPrice';
import DonutChart from '../../components/molecules/DonutChart';
import { Decimal } from 'decimal.js';

const Main = ({ currentUser, staticPortfolio }) => {
  const [dynamicPortfolio, setDynamicPortfolio] = useState([
    {
      avgPrice: '100',
      id: 1,
      price: '123.27000',
      quantity: '40',
      symbol: 'AAPL',
      userUid: 'cQAHr98ZikhaQzXfvU41Cfs3fCi2',
    },
    {
      avgPrice: '200',
      id: 2,
      price: '214.74001',
      quantity: '5',
      symbol: 'MSFT',
      userUid: 'cQAHr98ZikhaQzXfvU41Cfs3fCi2',
    },
    {
      avgPrice: '3000',
      id: 3,
      price: '3128.92505',
      quantity: '1',
      symbol: 'AMZN',
      userUid: 'cQAHr98ZikhaQzXfvU41Cfs3fCi2',
    },
    {
      avgPrice: '480',
      id: 4,
      price: '626.43378',
      quantity: '5',
      symbol: 'TSLA',
      userUid: 'cQAHr98ZikhaQzXfvU41Cfs3fCi2',
    },
  ]);
  const [pieChartData, setPieChartData] = useState([
    { name: 'AAPL', y: 38.46 },
    { name: 'AMZN', y: 28.85 },
    { name: 'TSLA', y: 23.08 },
    { name: 'MSFT', y: 9.62 },
  ]);
  const [total, setTotal] = useState(10400);

  // useEffect(() => {
  //   if (!currentUser) return;

  //   const fetchDynamicData = async () => {
  //     const portfolioWithRealPrice = await concatRealPrice(staticPortfolio);

  //     setDynamicPortfolio(portfolioWithRealPrice);
  //   };

  //   fetchDynamicData();
  // }, [currentUser, staticPortfolio]);

  // useEffect(() => {
  //   let total = 0;
  //   const data = [];

  //   dynamicPortfolio.forEach(item => {
  //     total += Number(item.avgPrice) * Number(item.quantity);
  //   });

  //   setTotal(total);

  //   dynamicPortfolio.forEach(item => {
  //     data.push({
  //       name: item.symbol,
  //       y: Number(new Decimal(Number(item.avgPrice) * Number(item.quantity)).dividedBy(new Decimal(total)).times(100).toDecimalPlaces(2).toString()),
  //     });
  //   });

  //   data.sort((a, b) => b.y - a.y);

  //   setPieChartData(data);
  // }, [dynamicPortfolio]);

  return (
    <>
      <div className='mainPageWrapper'>
        <DonutChart
          data={pieChartData}
          title='내 포트폴리오'
          centerText={`$${total}`}
        />
        <div className='recommendedPortfoliosWrapper'></div>
        <div className='companyCardsWrapper'></div>
      </div>
    </>
  );
};

export default Main;
