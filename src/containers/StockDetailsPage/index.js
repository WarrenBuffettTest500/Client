import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CompanyRecommendations from '../CompanyRecommendations';
import CandlestickChart from '../../components/molecules/CandlestickChart';
import dateToObject from '../../utils/dateToObject';
import StockDetailsDashboard from '../../components/organisms/StockDetailsDashboard';
import TabBar from '../../components/molecules/TabBar';
import LoadingIndicator from '../../components/molecules/LoadingIndicator';
import {
  setSearchStockDetails,
  setOneWeekStockDetails,
  setOneMonthStockDetails,
  initializeStockStates,
} from '../../store/stock';
import requestStockDetails from '../../api/requestStockDetails';
import requestRecommendationSymbolList from '../../api/requestRecommendationSymbolList';
import { setRecommendationSymbolList, setRecommendationSymbolInfo } from '../../store/stock';
import ChatRoom from '../../components/molecules/ChatRoom';
import requestHitUpdate from '../../api/requestHitUpdate';
import { useToasts } from 'react-toast-notifications';
import TOAST_APPEARANCES from '../../constants/toastAppearances';
import { CANDLESTICK_CHART_TABS, INTERVALS } from '../../constants/intervals';
import { RESPONSE_MESSAGES } from '../../constants/responses';

const StockDetails = () => {
  const { addToast } = useToasts();
  const { keyword: symbol } = useParams();
  const dispatch = useDispatch();
  const {
    searchStockDetails,
    oneWeekStockDetails,
    oneMonthStockDetails,
    recommendationSymbolList,
    currentUser,
  } = useSelector(state => ({
    searchKeyWord: state.stock.searchStockDetails?.meta.symbol,
    searchStockDetails: state.stock.searchStockDetails?.values,
    oneWeekStockDetails: state.stock.oneWeekStockDetails?.values,
    oneMonthStockDetails: state.stock.oneMonthStockDetails?.values,
    recommendationSymbolList: state.stock?.recommendationSymbolList,
    currentUser: state.user.currentUser,
  }));
  const [currentClickedTab, setCurrentClickedTab] = useState('');
  const [clickedTabList, setClickedTabList] = useState();
  const [dashboardData, setDashboardData] = useState({});

  const tabBarButtonClickHandler = async event => {
    const interval = event.target.dataset.apiParam;

    if (clickedTabList.includes(interval)) {
      setCurrentClickedTab(interval);

      return;
    }

    try {
      const {
        message: stockDetailsMessage,
        stockDetails,
      } = await requestStockDetails(symbol);

      if (stockDetailsMessage === RESPONSE_MESSAGES.NOT_FOUND) {
        addToast('기업 정보를 찾지 못했습니다', {
          appearance: TOAST_APPEARANCES.ERROR,
          autoDismiss: true,
        });

        return;
      }

      switch (interval) {
        case CANDLESTICK_CHART_TABS.ONE_Day:
          dispatch(setSearchStockDetails(stockDetails));
          break;
        case CANDLESTICK_CHART_TABS.ONE_WEEK:
          dispatch(setOneWeekStockDetails(stockDetails));
          break;
        case CANDLESTICK_CHART_TABS.ONE_MONTH:
          dispatch(setOneMonthStockDetails(stockDetails));
          break;
        default:
          return;
      }

      setClickedTabList([...clickedTabList, interval]);
      setCurrentClickedTab(interval);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    requestHitUpdate(symbol);
  }, [currentUser, symbol]);

  useEffect(() => {
    dispatch(initializeStockStates());
    setCurrentClickedTab(CANDLESTICK_CHART_TABS.ONE_Day);
    setClickedTabList([CANDLESTICK_CHART_TABS.ONE_Day]);
  }, [symbol]);

  useEffect(() => {
    (async () => {
      const { message: stockDetailsMessage, stockDetails } = await requestStockDetails(symbol);

      if (stockDetailsMessage === RESPONSE_MESSAGES.NOT_FOUND) {
        addToast('기업 정보를 찾지 못했습니다', {
          appearance: TOAST_APPEARANCES.ERROR,
          autoDismiss: true,
        });

        return;
      }

      dispatch(setSearchStockDetails(stockDetails));

      const { recommendationSymbolList, recommendationSymbolInfo }
        = await requestRecommendationSymbolList(symbol);

      dispatch(setRecommendationSymbolList(recommendationSymbolList));
      dispatch(setRecommendationSymbolInfo(recommendationSymbolInfo));
      setDashboardData({
        ...recommendationSymbolInfo,
        symbol,
        price: stockDetails.values[0].close,
      });
    })();
  }, [symbol]);

  return (
    <>
      <div className='stock_details_wrapper'>
        <div className='stock_details_left'>
          {!searchStockDetails && <LoadingIndicator />}
          {
            searchStockDetails
            && <div className='stock_item chart'>
              <StockDetailsDashboard data={dashboardData} />
              <TabBar onTabButtonClick={tabBarButtonClickHandler} />
              <div className='chart_wrapper'>
                {
                  currentClickedTab === CANDLESTICK_CHART_TABS.ONE_Day
                  && <CandlestickChart
                    data={dateToObject(searchStockDetails)}
                    interval={INTERVALS.DAY}
                  />
                }
                {
                  currentClickedTab === CANDLESTICK_CHART_TABS.ONE_WEEK
                  && <CandlestickChart
                    data={dateToObject(oneWeekStockDetails)}
                    interval={INTERVALS.WEEK}
                  />
                }
                {
                  currentClickedTab === CANDLESTICK_CHART_TABS.ONE_MONTH
                  && <CandlestickChart
                    data={dateToObject(oneMonthStockDetails)}
                    interval={INTERVALS.MONTH}
                  />
                }
              </div>
            </div>
          }

          <div className='card_list_title'>
            <p>성격이 비슷한 기업들을 알려드릴게요</p>
          </div>
          <div className='stock_item card_list'>
            {
              recommendationSymbolList
              && <CompanyRecommendations className='company_card_list container' />
            }
          </div>
        </div>
        <div className='stock_details_right'>
          <ChatRoom />
        </div>
      </div>
    </>
  );
};

export default StockDetails;
