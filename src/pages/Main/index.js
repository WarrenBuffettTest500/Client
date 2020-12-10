import React, { useState, useEffect } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import concatRealPrice from '../../utils/concatRealPrice';
import calculateProportions from '../../utils/calculateProportions';
import calculateTotal from '../../utils/calculateTotal';
import CircleChart from '../../components/molecules/CircleChart';

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
  const [chartData, setChartData] = useState([
    { name: 'AAPL', value: 38.46 },
    { name: 'AMZN', value: 28.85 },
    { name: 'TSLA', value: 23.08 },
    { name: 'MSFT', value: 9.62 },
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
  //   setTotal(calculateTotal(dynamicPortfolio));

  //   const portfolioByProportions
  //     = calculateProportions(dynamicPortfolio, total).sort((a, b) => b.y - a.y);

  //   setChartData(portfolioByProportions);
  // }, [dynamicPortfolio]);

  return (
    <>
      <div className='mainPageWrapper'>
        <Link to='/my_page'>
          <CircleChart data={chartData} type='donut' />
        </Link>
        <div className='recommendedPortfoliosWrapper'></div>
        <div className='companyCardsWrapper'></div>
      </div>
    </>
  );
};

export default Main;
