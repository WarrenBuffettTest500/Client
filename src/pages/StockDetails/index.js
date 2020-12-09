import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Card from '../../components/molecules/Card';
import ListWrapper from '../../components/molecules/ListWrapper';
import requestCompanyProfiles from '../../api/requestCompanyProfiles';
import requestStockDetails from '../../api/requestStockDetails';
import requestCompanyProfileUpdate from '../../api/requestCompanyProfileUpdate';
import CandlestickChart from '../../components/molecules/CandlestickChart';
import dateToObject from '../../utils/dateToObject';
import TabBar from '../../components/molecules/TabBar';
import {
  setSearchStockDetails,
  setOneWeekStockDetails,
  setOneMonthStockDetails
} from '../../store/stock';
import RESPONSES from '../../constants/responses';
import PATHS from '../../constants/paths';

const StockDetails = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const {
    searchKeyWord,
    searchStockDetails,
    oneWeekStockDetails,
    oneMonthStockDetails,
    recommendationSymbolList,
    sector,
    industry,
  } = useSelector(state =>
    ({
      searchKeyWord: state.stock.searchStockDetails.meta.symbol,
      searchStockDetails: state.stock.searchStockDetails?.values,
      oneWeekStockDetails: state.stock.oneWeekStockDetails?.values,
      oneMonthStockDetails: state.stock.oneMonthStockDetails?.values,
      recommendationSymbolList: state.stock.recommendationSymbolList,
      sector: state.stock.recommendationSymbolInfo.sector,
      industry: state.stock.recommendationSymbolInfo.industry,
    }));

  const [companyProfileList, setCompanyProfileList] = useState([]);
  const [currentClickedTab, setCurrentClickedTab] = useState('1day');
  const [clickedTabList, setClickedTabList] = useState(['1day']);

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
    (async () => {
      await requestCompanyProfileUpdate(keyword);
    })();
  }, []);

  useEffect(() => {
    if (!recommendationSymbolList) return;

    (async () => {
      const data = await requestCompanyProfiles(recommendationSymbolList);
      setCompanyProfileList(data);
    })();
  }, [recommendationSymbolList]);

  return (
    <>
      <div className='stock_details_wrapper'>
        <div className='stock_details_left'>
          <div className='stock_item_chart'>
            <h1>chart</h1>
            <TabBar onTabButtonClick={tabBarButtonClickHandle} />
            {
              currentClickedTab === '1day' && <CandlestickChart data={dateToObject(searchStockDetails)} />
            }
            {
              currentClickedTab === '1week' && <CandlestickChart data={dateToObject(oneWeekStockDetails)} />
            }
            {
              currentClickedTab === '1month' && <CandlestickChart data={dateToObject(oneMonthStockDetails)} />
            }
          </div>
          <div className='stock_item_card_list'>
            <h1>card</h1>
          <h3>{`${sector} / ${industry}`}</h3>
            <ListWrapper className='companyCardListWrapper'>
              {companyProfileList.map(companyProfile =>
                <Card
                  key={companyProfile['Global Quote']['01. symbol']}
                  className='companyCard'>
                  <h3>{companyProfile['Global Quote']['01. symbol']}</h3>
                  <p>{`$${companyProfile['Global Quote']['05. price']}`}</p>
                  <p>{companyProfile['Global Quote']['10. change percent']}</p>
                </Card>)}
            </ListWrapper>
          </div>
        </div>
        <div className='stock_details_right'>
          <h1>chat</h1>
        </div>
      </div>
    </>
  );
};

export default StockDetails;
