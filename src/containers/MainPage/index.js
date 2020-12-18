import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useHistory } from 'react-router-dom';
import concatRealPrice from '../../utils/concatRealPrice';
import calculateProportions from '../../utils/calculateProportions';
import calculateTotal from '../../utils/calculateTotal';
import CircleChart from '../../components/molecules/CircleChart';
import requestRecommendations from '../../api/requestRecommendations';
import requestTrendingStocks from '../../api/requestTrendingStocks';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import LoadingIndicator from '../../components/molecules/LoadingIndicator';
import { setRecommendationCriterion } from '../../store/user';
import TrendingList from '../../components/molecules/TrendingList';
import formatPortfoliosToChartData from '../../utils/formatPortfoliosToChartData';
import NUMBERS from '../../constants/numbers';

const Main = ({ setIsModalOpen }) => {
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
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [recommendedChartDatas, setRecommendedChartDatas] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [hasMoreRecommendations, setHasMoreRecommendations] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoadingMyPortfolio, setIsLoadingMyPortfolio] = useState(true);
  const history = useHistory();
  const cardRefs = useRef({});
  const observer = useRef();
  const lastRecommendationRef = useCallback(recommendation => {
    if (isLoadingRecommendations || !hasMoreRecommendations) return;
    if (observer.current) observer.current.disconnect();
    if (recommendationCriterion === 'random') return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(previous => previous + NUMBERS.ONE);
      }
    });

    if (recommendation) observer.current.observe(recommendation);
  });

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      const trendingStocksResponse = await requestTrendingStocks();
      setTrendingStocks(trendingStocksResponse.topTen);
    };

    fetchTrendingStocks();

    const setFetchInterval = setInterval(fetchTrendingStocks, NUMBERS.ONE_MINUTE);

    return () => clearInterval(setFetchInterval);
  }, []);

  useEffect(() => {
    if (!staticPortfolio.length) setIsLoadingMyPortfolio(false);
  }, [staticPortfolio]);

  useEffect(() => {
    if (!currentUser && recommendationCriterion !== 'random') return;

    setIsLoadingRecommendations(true);

    const fetchRecommendations = async () => {
      const { portfolios, hasMore }
        = await requestRecommendations(recommendationCriterion, currentUser, page);

      setRecommendedChartDatas(formatPortfoliosToChartData(portfolios));
      setIsLoadingRecommendations(false);
      if (hasMore === false) setHasMoreRecommendations(false);
    };

    fetchRecommendations();
  }, [currentUser, recommendationCriterion, staticPortfolio]);

  useEffect(() => {
    if (!page || !hasMoreRecommendations || isLoadingRecommendations) return;

    setIsLoadingRecommendations(true);

    const concatRecommendations = async () => {
      const { portfolios, hasMore }
        = await requestRecommendations(recommendationCriterion, currentUser, page);

      setRecommendedChartDatas(previous => (
        [...previous, ...formatPortfoliosToChartData(portfolios)]
      ));
      setIsLoadingRecommendations(false);
      if (hasMore === false) setHasMoreRecommendations(false);
    };

    concatRecommendations();
  }, [page]);

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
    setIsLoadingMyPortfolio(false);
  }, [total]);

  const recommendationToggleHandler = () => {
    if (recommendationCriterion === 'portfolio') {
      dispatch(setRecommendationCriterion('preference'));
    } else {
      dispatch(setRecommendationCriterion('portfolio'));
    }

    setPage(0);
    setHasMoreRecommendations(true);
  };

  const myPortfolioClickHandler = () => {
    if (!currentUser) {
      setIsModalOpen(true);
      return;
    }
    history.push(`/users/${currentUser?.uid}/portfolios/${currentUser?.uid}`);
  };

  const recommendationPortfolioClickHandler = portfolio => {
    history.push(`/users/${currentUser?.uid}/portfolios/${portfolio.owner}`);
  };

  return (
    <div className='mainpage_wrapper'>
      <div className='main_page_dashboard_wrapper'>
        {
          currentUser
            ? <Card className='my_portfolio_card'>
              {
                isLoadingMyPortfolio
                  ? <LoadingIndicator />
                  : (
                    staticPortfolio.length
                      ? <>
                        <div className='circle_chart_wrapper mychart'>
                          <CircleChart
                            data={chartData}
                            type='donut'
                            total={total}
                          />
                        </div>
                        <Button
                          className='my_portfolio_button'
                          onClick={myPortfolioClickHandler}
                        >
                          <DashboardIcon className='dash_board_icon' />
                        </Button>
                      </>
                      : <>
                        <p>포트폴리오를 등록해주세요👀</p>
                        <div
                          onClick={myPortfolioClickHandler}
                          className='card_message'
                        >
                          go to my portfolio
                      </div>
                      </>
                  )
              }
            </Card>
            : <Card className='my_portfolio_card'>
              <p>go to my portfolio</p>
              <div
                onClick={myPortfolioClickHandler}
                className='card_message'
              >
                로그인하고 포트폴리오를 관리하세요
             </div>
            </Card>
        }
        <TrendingList symbols={trendingStocks} />
      </div>
      <div className='recommended_portfolios_title'>
        {
          (!currentUser || (currentUser && recommendationCriterion === 'random'))
            ? <span>주식을 등록하시면 포트폴리오를 추천해드립니다</span>
            : <span>
              {
                `${currentUser.displayName}님의 ${recommendationCriterion === 'preference' ? '투자 성향' : '보유 주식'}을 분석해 추천 포트폴리오를 모아봤어요`
              }
            </span>
        }
      </div>
      <div className='toggle_button_wrapper'>
        {
          (recommendationCriterion === 'portfolio' || recommendationCriterion === 'preference')
          && <Button
            className='portfolio_toggle_button'
            onClick={recommendationToggleHandler}
          >
            {
              recommendationCriterion === 'portfolio'
                ? '투자성향 기준으로 바꾸기'
                : '보유주식 기준으로 바꾸기'
            }
          </Button>
        }
      </div>
      <div className='recommended_portfolios_wrapper'>
        {
          recommendedChartDatas.map((portfolio, index) => {
            const isLastRecommendatioinData = index === recommendedChartDatas.length - 1;

            return (
              <div
                key={portfolio.owner}
                ref={element => isLastRecommendatioinData ? lastRecommendationRef(element) : 'null'}
                className='portfolio_card'
              >
                <Card
                  key={portfolio.owner}
                  className='portfolio_card'
                >
                  <div
                    ref={element => cardRefs.current[index] = element}
                    className='portfolio_wrapper'
                  >
                    <div className='portfolio_content'>
                      <div className='circle_chart_wrapper'>
                        {
                          currentUser
                          && <Button
                            className='portfolio_button'
                            onClick={() => recommendationPortfolioClickHandler(portfolio)}
                          >
                            <DashboardIcon className='dash_board_icon' />
                          </Button>
                        }
                        <CircleChart
                          data={portfolio.items}
                          type='pie'
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Main;
