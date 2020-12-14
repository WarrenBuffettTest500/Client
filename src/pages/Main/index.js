import React, { useState, useEffect } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import concatRealPrice from '../../utils/concatRealPrice';
import calculateProportions from '../../utils/calculateProportions';
import calculateTotal from '../../utils/calculateTotal';
import CircleChart from '../../components/molecules/CircleChart';
import requestRecommendations from '../../api/requestRecommendations';
import requestTrendingStocks from '../../api/requestTrendingStocks';

const Main = ({ currentUser, staticPortfolio }) => {
  const [dynamicPortfolio, setDynamicPortfolio] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [recommendationCriterion, setRecommendationCriterion] = useState('randomCompanies');
  const [recommendedChartDatas, setRecommendedChartDatas] = useState([]);
  const [trendingStocks, setTrendingStocks] = useState([]);

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      const trendingStocksResponse = await requestTrendingStocks();

      setTrendingStocks(trendingStocksResponse.topTen);
    };

    fetchTrendingStocks();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setRecommendationCriterion('randomCompanies');

      return;
    }

    setRecommendationCriterion('portfolio');
  }, [currentUser]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendationsResponse = await requestRecommendations(recommendationCriterion, currentUser, staticPortfolio);

      if (recommendationCriterion === 'randomCompanies') {
        return;
      } else {
        const recommendedChartDatas = [];

        const formatPortfolios = () => {
          recommendationsResponse.portfolios.forEach(portfolio => {
            const total = calculateTotal(portfolio.items);

            recommendedChartDatas.push({
              owner: portfolio.owner,
              items: calculateProportions(portfolio.items, total),
            });
          });
        };

        formatPortfolios();

        setRecommendedChartDatas(recommendedChartDatas);
      }
    };

    fetchRecommendations();
  }, [currentUser, recommendationCriterion, staticPortfolio]);

  useEffect(() => {
    if (!currentUser) return;

    if (!staticPortfolio.length) {
      setRecommendationCriterion('randomCompanies');

      return;
    }

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

  const recommendationToggleHandler = () => {
    if (recommendationCriterion === 'portfolio') {
      setRecommendationCriterion('preference');
    } else {
      setRecommendationCriterion('portfolio');
    }
  };

  return (
    <>
      <div className='mainPageWrapper'>
        {
          (currentUser && staticPortfolio.length)
            ? <Link to={`/users/${currentUser?.uid}/portfolios/${currentUser?.uid}`}>
              <CircleChart data={chartData} type='donut' />
            </Link>
            : '포트폴리오를 등록하세요'
        }
        {
          (recommendationCriterion === 'portfolio' || recommendationCriterion === 'preference')
          && <button onClick={recommendationToggleHandler}>토글</button>
        }
        <div className='recommendedPortfoliosWrapper'>
          {
            recommendedChartDatas.map(portfolio => {
              return (
                <Link to={`/users/${currentUser?.uid}/portfolios/${portfolio.owner}`} key={portfolio.owner}>
                  <CircleChart
                    data={portfolio.items}
                    type='pie'
                  />
                </Link>
              );
            })
          }
        </div>
      </div>
    </>
  );
};

export default Main;
