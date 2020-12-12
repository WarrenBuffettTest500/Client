import React, { useState, useEffect } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import concatRealPrice from '../../utils/concatRealPrice';
import calculateProportions from '../../utils/calculateProportions';
import calculateTotal from '../../utils/calculateTotal';
import CircleChart from '../../components/molecules/CircleChart';
import requestRecommendations from '../../api/requestRecommendations';

const Main = ({ currentUser, staticPortfolio }) => {
  const [dynamicPortfolio, setDynamicPortfolio] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [recommendationCriterion, setRecommendationCriterion] = useState('portfolio');
  const [portfoliosToDisplay, setPortfoliosToDisplay] = useState([]);
  const [recommendationsChartDatas, setRecommendationsChartDatas] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchDynamicData = async () => {
      const portfolioWithRealPrice = await concatRealPrice(staticPortfolio);
      setDynamicPortfolio(portfolioWithRealPrice);
    };

    fetchDynamicData();
  }, [currentUser, staticPortfolio]);

  useEffect(() => {
    if (!dynamicPortfolio.length) return;

    setTotal(calculateTotal(dynamicPortfolio));
  }, [dynamicPortfolio]);

  useEffect(() => {
    if (!total) return;

    const portfolioByProportions
      = calculateProportions(dynamicPortfolio, total);

    setChartData(portfolioByProportions);
  }, [total]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendationsResponse = await requestRecommendations(currentUser, staticPortfolio, recommendationCriterion);

      setPortfoliosToDisplay(recommendationsResponse.portfolios);
    };

    fetchRecommendations();
  }, [currentUser, recommendationCriterion, staticPortfolio]);

  useEffect(() => {
    const recommendationsChartDatas = [];

    const formatPortfolios = () => {
      portfoliosToDisplay.forEach(portfolio => {
        const total = calculateTotal(portfolio.items);

        recommendationsChartDatas.push({
          owner: portfolio.owner,
          items: calculateProportions(portfolio.items, total),
        });
      });
    };

    formatPortfolios();

    setRecommendationsChartDatas(recommendationsChartDatas);
  }, [portfoliosToDisplay]);

  const recommendationToggleHandler = () => {
    if (recommendationCriterion === 'portfolio') setRecommendationCriterion('preference');
    else setRecommendationCriterion('portfolio');
  };

  return (
    <>
      <div className='mainPageWrapper'>
        <Link to='/my_page'>
          <CircleChart data={chartData} type='donut' />
        </Link>
        <button onClick={recommendationToggleHandler}>토글</button>
        <div className='recommendedPortfoliosWrapper'>
          {
            recommendationsChartDatas.map(portfolio => {
              return (
                <CircleChart
                  key={portfolio.owner}
                  data={portfolio.items}
                  type='pie'
                />
              );
            })
          }
        </div>
      </div>
    </>
  );
};

export default Main;
