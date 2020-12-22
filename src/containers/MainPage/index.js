import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import concatRealPrice from '../../utils/concatRealPrice';
import calculateProportions from '../../utils/calculateProportions';
import calculateTotal from '../../utils/calculateTotal';
import CircleChart from '../../components/molecules/CircleChart';
import fetchRecommendations from '../../api/fetchRecommendations';
import requestTrendingStocks from '../../api/requestTrendingStocks';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import LoadingIndicator from '../../components/molecules/LoadingIndicator';
import { setRecommendationCriterion } from '../../store/user';
import TrendingList from '../../components/molecules/TrendingList';
import formatPortfoliosToChartData from '../../utils/formatPortfoliosToChartData';
import NUMBERS from '../../constants/numbers';
import TOAST_APPEARANCES from '../../constants/toastAppearances';
import { useToasts } from 'react-toast-notifications';

const Main = ({ setIsModalOpen }) => {
  const {
    currentUser,
    staticPortfolio,
    recommendationCriterion,
  } = useSelector(state => ({
    currentUser: state.user.currentUser,
    staticPortfolio: state.user.staticPortfolio,
    recommendationCriterion: state.user.recommendationCriterion,
  }));
  const dispatch = useDispatch();
  const [dynamicPortfolio, setDynamicPortfolio] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [recommendedChartDatas, setRecommendedChartDatas] = useState([]);
  const [isLoadingMyPortfolio, setIsLoadingMyPortfolio] = useState(true);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [hasMoreRecommendations, setHasMoreRecommendations] = useState(true);
  const [page, setPage] = useState(0);
  const history = useHistory();
  const cardRefs = useRef({});
  const observer = useRef();
  const { addToast } = useToasts();

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
    setIsLoadingRecommendations(true);

    const loadRecommendations = async () => {
      const { portfolios, hasMore }
        = await fetchRecommendations(recommendationCriterion, currentUser, page);

      setRecommendedChartDatas(formatPortfoliosToChartData(portfolios));
      setIsLoadingRecommendations(false);
      if (hasMore === false) setHasMoreRecommendations(false);
    };

    loadRecommendations();
  }, [currentUser, recommendationCriterion, staticPortfolio]);

  useEffect(() => {
    if (!page || !hasMoreRecommendations || isLoadingRecommendations) return;

    setIsLoadingRecommendations(true);

    const concatRecommendations = async () => {
      const { portfolios, hasMore }
        = await fetchRecommendations(recommendationCriterion, currentUser, page);

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
      if (!currentUser.preferenceInfoId) {
        addToast('투자성향을 먼저 등록해 주세요', {
          appearance: TOAST_APPEARANCES.WARNING,
          autoDismiss: true,
        });

        dispatch(setRecommendationCriterion('portfolio'));

        return;
      }

      dispatch(setRecommendationCriterion('preference'));
    } else {
      if (!staticPortfolio.length) {
        addToast('보유 주식을 먼저 등록해 주세요', {
          appearance: TOAST_APPEARANCES.WARNING,
          autoDismiss: true,
        });

        dispatch(setRecommendationCriterion('preference'));

        return;
      }

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
    if (!currentUser || !staticPortfolio.length) {
      addToast('포트폴리오를 등록해야 구경할 수 있습니다', {
        appearance: TOAST_APPEARANCES.WARNING,
        autoDismiss: true,
      });

      return;
    }

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
                      ? <div
                        className='circle_chart_wrapper mychart'
                        onClick={myPortfolioClickHandler}
                      >
                        <CircleChart
                          data={chartData}
                          type='donut'
                          total={total}
                        />
                      </div>
                      : <>
                        <p>포트폴리오를 등록해 주세요👀</p>
                        <div
                          onClick={myPortfolioClickHandler}
                          className='card_message'
                        >
                          내 포트폴리오 관리하러 가기
                      </div>
                      </>
                  )
              }
            </Card>
            : <Card className='my_portfolio_card'>
              <p>로그인하고 포트폴리오를 관리하세요</p>
              <div
                onClick={myPortfolioClickHandler}
                className='card_message'
              >
                먼저 로그인해 주세요
             </div>
            </Card>
        }
        <TrendingList symbols={trendingStocks} />
      </div>
      <div className='recommended_portfolios_title'>
        {
          (!currentUser || (currentUser && recommendationCriterion === 'random'))
            ? <span>투자성향 또는 주식을 등록하시면 포트폴리오를 추천해 드려요</span>
            : <span>
              {
                `${currentUser.displayName}님의 ${recommendationCriterion === 'preference' ? '투자 성향' : '보유 주식'}을 분석해 추천 포트폴리오를 모아봤어요`
              }
            </span>
        }
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
            const isLastRecommendationData
              = index === recommendedChartDatas.length - 1;

            return (
              <div
                key={portfolio.owner}
                ref={element => isLastRecommendationData ? lastRecommendationRef(element) : 'null'}
                className='recommendation_wrapper'
              >
                <Card className='portfolio_card'>
                  <div
                    className='circle_chart_wrapper portfolio_wrapper'
                    ref={element => cardRefs.current[index] = element}
                    onClick={() => recommendationPortfolioClickHandler(portfolio)}
                  >
                    <CircleChart
                      data={portfolio.items}
                      type='pie'
                      category='recommended'
                    />
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
