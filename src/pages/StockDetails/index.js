import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ListContainer from '../../containers/ListContainer';
import CandlestickChart from '../../components/molecules/CandlestickChart';
import dateToObject from '../../utils/dateToObject';
import Dashbord from '../../components/molecules/Dashbord';
import TabBar from '../../components/molecules/TabBar';
import Loader from '../../components/molecules/Loader';
import {
  setSearchStockDetails,
  setOneWeekStockDetails,
  setOneMonthStockDetails,
  initializeStockStates,
} from '../../store/stock';
import PATHS from '../../constants/paths';
import requestStockDetails from '../../api/requestStockDetails';
import requestRecommendationSymbolList from '../../api/requestRecommendationSymbolList';
import RESPONSES from '../../constants/responses';
import { setRecommendationSymbolList, setRecommendationSymbolInfo } from '../../store/stock';
import ChatRoom from '../../components/molecules/ChatRoom';
import requestHitUpdate from '../../api/requestHitUpdate';

const StockDetails = () => {
  const { keyword : symbol } = useParams();
  const dispatch = useDispatch();
  const {
    searchKeyWord,
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
  const [dashbordData, setDashbordData] = useState({});

  const tabBarButtonClickHandle = async event => {
    const interval = event.target.dataset.apiParam;

    if (clickedTabList.includes(interval)) {
      setCurrentClickedTab(interval);
      return;
    }

    try {
      const { result, stockDetails } = await requestStockDetails(searchKeyWord, interval);

      if (result === RESPONSES.OK) {
        switch (interval) {
          case '1day':
            dispatch(setSearchStockDetails(stockDetails));
            break;
          case '1week':
            dispatch(setOneWeekStockDetails(stockDetails));
            break;
          case '1month':
            dispatch(setOneMonthStockDetails(stockDetails));
            break;
          default: dispatch(setSearchStockDetails(stockDetails));
            break;
        }

        setClickedTabList([...clickedTabList, interval]);
        setCurrentClickedTab(interval);

        return;
      }

      if (result === RESPONSES.FAILURE) {
        history.push(PATHS.FAILURE);

        return;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    requestHitUpdate(symbol);
  }, [currentUser, symbol]);

  useEffect(() => {
    dispatch(initializeStockStates());
    setCurrentClickedTab('1day');
    setClickedTabList(['1day']);
  }, [symbol]);

  useEffect(() => {
    (async () => {
      const { result, stockDetails } = await requestStockDetails(symbol);

      if (result === RESPONSES.OK) {
        dispatch(setSearchStockDetails(stockDetails));
        const { result, recommendationSymbolList, recommendationSymbolInfo } = await requestRecommendationSymbolList(symbol);

        if (result === RESPONSES.OK) {
          dispatch(setRecommendationSymbolList(recommendationSymbolList));
        }

        if (result === RESPONSES.FAILURE) {
          alert('리스트를 가져오지 못했습니다');
        }
        dispatch(setRecommendationSymbolInfo(recommendationSymbolInfo));
        setDashbordData({...recommendationSymbolInfo, symbol, price: stockDetails.values[0].close});
        return;
      }

      if (result === RESPONSES.FAILURE) {
        history.push(PATHS.FAILURE);

        return;
      }
    })();
  }, [symbol]);

  return (
    <>
      <div className='stock_details_wrapper'>
        <div className='stock_details_left'>
          <div className='stock_item chart'>
            {
            !searchStockDetails
            ? <Loader />
            : <>
              <Dashbord data={dashbordData} />
              <TabBar onTabButtonClick={tabBarButtonClickHandle} />
              <div className='chart_wrapper'>
                {currentClickedTab === '1day' && <CandlestickChart data={dateToObject(searchStockDetails)} interval='day' />}
                {currentClickedTab === '1week' && <CandlestickChart data={dateToObject(oneWeekStockDetails)} interval='week' />}
                {currentClickedTab === '1month' && <CandlestickChart data={dateToObject(oneMonthStockDetails)} interval='month' />}
              </div>
              </>
            }
          </div>
          <div className='card_list_title'>
            <p>Similar Company Stock</p>
          </div>
          <div className='stock_item card_list'>
          {recommendationSymbolList && <ListContainer className='company_card_list container' />}
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
