import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import concatRealPrice from '../../utils/concatRealPrice';
import calculateProportions from '../../utils/calculateProportions';
import calculateTotal from '../../utils/calculateTotal';
import CircleChart from '../../components/molecules/CircleChart';
import requestRecommendations from '../../api/requestRecommendations';
import requestTrendingStocks from '../../api/requestTrendingStocks';
import Card from '../../components/molecules/Card';
import Button from '../../components/atoms/Button';

const Main = ({ currentUser, staticPortfolio }) => {
  const [dynamicPortfolio, setDynamicPortfolio] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [recommendationCriterion, setRecommendationCriterion] = useState('randomCompanies');
  const [recommendedChartDatas, setRecommendedChartDatas] = useState([]);
  const history = useHistory();
  const cardRefs = useRef({});

  const [trendingStocks, setTrendingStocks] = useState([]);

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      const trendingStocksResponse = await requestTrendingStocks();

      setTrendingStocks(trendingStocksResponse.topTen);
    };

    const setFetchInterval = setInterval(fetchTrendingStocks, 60 * 1000);

    return () => clearInterval(setFetchInterval);
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

  const onPortFolioButtonClick = (e, portfolio) => {
    const { name } = e.target;

    if (name === 'myportfoliio') {
      history.push(`/users/${currentUser?.uid}/portfolios/${currentUser?.uid}`);
      return;
    }
    history.push(`/users/${currentUser?.uid}/portfolios/${portfolio.owner}`);
  };

  const scrollIntoView = i => {
    cardRefs.current[i - 3]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='mainpage_wrapper'>
      <div className='myportfolio_card_wrapper'>
        <Card className='portfolio_card'>
          {currentUser && staticPortfolio.length ?
            <>
              <div className='circle_chart_wrapper mychart'>
                <CircleChart data={chartData} type='donut' />
              </div>
              <Button
                className='portfolio_button'
                name='myportfoliio'
                onClick={e => recommendationToggleHandler(e)}>
                MY PORTFOLIO
              </Button>
            </>
            : '포트폴리오를 등록하세요'
          }
        </Card>
      </div>
      <div className='toggle_button_wrapper'>
        {
          (recommendationCriterion === 'portfolio' || recommendationCriterion === 'preference') &&
          <Button
            className='portfolio_toggle_button'
            onClick={recommendationToggleHandler}>
            {recommendationCriterion === 'portfolio' ? '투자 성향 기준으로 보기' : '보유 주식 기준으로 보기'}
          </Button>
        }
      </div>
      <div className='recommended_portfolios_wrapper'>
        {recommendedChartDatas.map((portfolio, i) => {
          return (
            <Card
              key={portfolio.owner}
              className='portfolio_card'>
              <div
                ref={element => cardRefs.current[i] = element}
                className='portfolio_wrapper'>
                <div className='portfolio_front'>
                  <div className='circle_chart_wrapper'>
                    <CircleChart
                      data={portfolio.items}
                      type='pie'
                    />
                    <h3>This Is Title Article</h3>
                  </div>
                </div>
                <div
                  className='portfolio_back'
                >
                  <div className='portfolio_back_item'>
                    <h3 onMouseOver={() => scrollIntoView(i)}>This Is Title Article</h3>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
	   			              </p>
                    <Button
                      className='portfolio_button'
                      onClick={e => onPortFolioButtonClick(e, portfolio)}>show</Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Main;
