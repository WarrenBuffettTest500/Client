import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './index.scss';
import { Link } from 'react-router-dom';
import concatRealPrice from '../../utils/concatRealPrice';
import calculateProportions from '../../utils/calculateProportions';
import calculateTotal from '../../utils/calculateTotal';
import CircleChart from '../../components/molecules/CircleChart';
import requestRecommendations from '../../api/requestRecommendations';
import requestTrendingStocks from '../../api/requestTrendingStocks';
import Card from '../../components/molecules/Card';
import { setRecommendationCriterion } from '../../store/user';

const Main = () => {
  const dispatch = useDispatch();
  const {
    currentUser,
    staticPortfolio,
    recommendationCriterion,
  } = useSelector(state => ({
    currentUser: state.user.currentUser,
    staticPortfolio: state.user.staticPortfolio,
    recommendationCriterion: state.user.recommendationCriterion,
  }));
  const [dynamicPortfolio, setDynamicPortfolio] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [recommendedChartDatas, setRecommendedChartDatas] = useState([]);
  const [trendingStocks, setTrendingStocks] = useState([]);

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      const trendingStocksResponse = await requestTrendingStocks();
      console.log(trendingStocksResponse.topTen);
      setTrendingStocks(trendingStocksResponse.topTen);
    };

    const setFetchInterval = setInterval(fetchTrendingStocks, 60 * 1000);

    return () => clearInterval(setFetchInterval);
  }, []);

  useEffect(() => {
    if (!currentUser && recommendationCriterion !== 'random') return;

    const fetchRecommendations = async () => {
      const recommendationsResponse = await requestRecommendations(recommendationCriterion, currentUser);

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

    };

    fetchRecommendations();
  }, [currentUser, recommendationCriterion, staticPortfolio]);

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

  const recommendationToggleHandler = () => {
    if (recommendationCriterion === 'portfolio') {
      dispatch(setRecommendationCriterion('preference'));
    } else {
      dispatch(setRecommendationCriterion('portfolio'));
    }
  };

  return (
    <>
      <div className='mainpage_wrapper'>
        <div>
          {
            (currentUser && staticPortfolio.length)
              ? <Link to={`/users/${currentUser?.uid}/portfolios/${currentUser?.uid}`}>
                <CircleChart data={chartData} type='donut' />
              </Link>
              : '포트폴리오를 등록하세요'
          }
        </div>
        <div>
          {
            (recommendationCriterion === 'portfolio' || recommendationCriterion === 'preference')
            && <button onClick={recommendationToggleHandler}>토글</button>
          }
        </div>
        <div className='recommended_portfolios_wrapper'>
          {
            recommendedChartDatas.map(portfolio => {
              return (
                <Link to={`/users/${currentUser?.uid}/portfolios/${portfolio.owner}`} key={portfolio.owner}>
                  <Card>
                    <div className='portfolios_wrapper'></div>
                    <div className='circle_chart_wrapper'>
                      <CircleChart
                        data={portfolio.items}
                        type='pie'
                      />
                    </div>
                  </Card>
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
