import React, { useState, useEffect } from 'react';
import './index.scss';
import PortfolioItemInputModal from '../../components/molecules/PortfolioItemInputModal';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import Button from '../../components/atoms/Button';
import { Decimal } from 'decimal.js';
import requestPortfolioItemDelete from '../../api/requestPortfolioItemDelete';
import concatRealPrice from '../../utils/concatRealPrice';
import CircleChart from '../../components/molecules/CircleChart';
import calculateProportions from '../../utils/calculateProportions';
import requestPortfolio from '../../api/requestPortfolio';

const MyPage = ({
  currentUser,
  staticPortfolio,
  onStaticPortfolioFetched,
}) => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [dynamicPortfolio, setDynamicPortfolio] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total: 0,
    return: 0,
    earningsRate: 0,
  });
  const [portfolioItemToEdit, setPortfolioItemToEdit] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!staticPortfolio.length) {
      setDynamicPortfolio([]);
      setDashboardData({
        total: 0,
        return: 0,
        earningsRate: 0,
      });
      setChartData([]);

      return;
    }

    const setMyPageData = async () => {
      const portfolioWithRealPrice = await concatRealPrice(staticPortfolio);

      setDynamicPortfolio(portfolioWithRealPrice);

      const updatedDashboardData = {
        total: 0,
        return: 0,
        earningsRate: 0,
      };

      let originalCapital = 0;

      portfolioWithRealPrice.forEach(portfolioItem => {
        const { price, avgPrice, quantity } = portfolioItem;
        updatedDashboardData.total = new Decimal(price).times(new Decimal(quantity)).plus(new Decimal(updatedDashboardData.total)).toDecimalPlaces(2).toString();
        updatedDashboardData.return = new Decimal(price).minus(new Decimal(avgPrice)).times(new Decimal(quantity)).plus(new Decimal(updatedDashboardData.return)).toDecimalPlaces(2).toString();
        originalCapital = new Decimal(avgPrice).times(new Decimal(quantity)).plus(new Decimal(originalCapital)).toDecimalPlaces(2).toString();
      });

      updatedDashboardData.earningsRate = `${new Decimal(updatedDashboardData.return).dividedBy(new Decimal(originalCapital)).times(100).toDecimalPlaces(2).toString()}%`;

      setDashboardData({
        total: updatedDashboardData.total,
        return: updatedDashboardData.return,
        earningsRate: updatedDashboardData.earningsRate,
      });
    };

    setMyPageData();
  }, [staticPortfolio]);

  useEffect(() => {
    if (!dynamicPortfolio.length || !dashboardData.total) return;

    const portfolioByProportions
      = calculateProportions(dynamicPortfolio, dashboardData.total);

    setChartData(portfolioByProportions);
  }, [dynamicPortfolio, dashboardData]);

  const createClickHandler = () => {
    setIsInputModalOpen(true);
  };

  const editClickHandler = (portfolioItemId, symbol, quantity, avgPrice) => {
    setPortfolioItemToEdit({
      portfolioItemId,
      symbol,
      quantity,
      avgPrice,
    });

    setIsInputModalOpen(true);
  };

  const deleteClickHandler = async portfolioItemId => {
    const confirm = window.confirm('삭제하시겠습니까?');

    if (!confirm) return;

    const deleteResponse = await requestPortfolioItemDelete(currentUser, portfolioItemId);

    if (deleteResponse.result !== 'ok') {
      alert('삭제하지 못했습니다');

      return;
    }

    const fetchStaticPortfolio = async () => {
      const staticPortfolioResponse = await requestPortfolio(currentUser);

      onStaticPortfolioFetched(staticPortfolioResponse.portfolio);
    };

    fetchStaticPortfolio();
  };

  return (
    <>
      <div className='myPageWrapper'>
        <div className='graphsWrapper'>
          <CircleChart data={chartData} type='pie' />
        </div>
        <div className='dashboard'>
          <div>
            {`총 자산: ${dashboardData.total}`}
          </div>
          <div>
            {`수익: ${dashboardData.return}`}
          </div>
          <div>
            {`수익률: ${dashboardData.earningsRate}`}
          </div>
        </div>
        <div className='tableWrapper'>
          <div className='tableTitle'>
            <h3>내 주식 목록</h3>
            <button onClick={createClickHandler}>더하기</button>
          </div>
          <table className='table'>
            <tbody>
              <tr>
                <th>기업</th>
                <th>보유량</th>
                <th>평균단가</th>
                <th>현재가격</th>
                <th>손익</th>
                <th>수익률</th>
                <th>평가금액</th>
                <th>매입금액</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
              {
                dynamicPortfolio.map(item => {
                  const { id, symbol, quantity, avgPrice, price } = item;
                  return (
                    <tr key={id}>
                      <td>{symbol}</td>
                      <td>{quantity}</td>
                      <td>{avgPrice}</td>
                      <td>{new Decimal(price).toDecimalPlaces(2).toString()}</td>
                      <td>{new Decimal(price).minus(new Decimal(avgPrice)).times(new Decimal(quantity)).toDecimalPlaces(2).toString()}</td>
                      <td>{(new Decimal(price).dividedBy(new Decimal(avgPrice))).minus(1).times(100).toDecimalPlaces(2).toString()}</td>
                      <td>{new Decimal(price).times(new Decimal(quantity)).toDecimalPlaces(2).toString()}</td>
                      <td>{new Decimal(avgPrice).times(new Decimal(quantity)).toDecimalPlaces(2).toString()}</td>
                      <td>
                        <Button
                          className='editButton'
                          onClick={editClickHandler.bind(null, id, symbol, quantity, avgPrice)}
                        >
                          <EditOutlinedIcon />
                        </Button>
                      </td>
                      <td>
                        <Button
                          className='deleteButton'
                          onClick={deleteClickHandler.bind(null, id)}
                        >
                          <ClearRoundedIcon />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      {
        isInputModalOpen
        && <PortfolioItemInputModal
          currentUser={currentUser}
          setIsInputModalOpen={setIsInputModalOpen}
          portfolioItemToEdit={portfolioItemToEdit}
          setPortfolioItemToEdit={setPortfolioItemToEdit}
          staticPortfolio={staticPortfolio}
          onStaticPortfolioFetched={onStaticPortfolioFetched}
        />
      }
    </>
  );
};
export default MyPage;
