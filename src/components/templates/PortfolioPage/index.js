import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PortfolioItemInputModal from '../../molecules/PortfolioItemInputModal';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import Button from '../../atoms/Button';
import { Decimal } from 'decimal.js';
import requestPortfolioItemDelete from '../../../api/requestPortfolioItemDelete';
import concatRealPrice from '../../../utils/concatRealPrice';
import CircleChart from '../../molecules/CircleChart';
import calculateProportions from '../../../utils/calculateProportions';
import requestPortfolio from '../../../api/requestPortfolio';
import commaNumber from 'comma-number';
import { useToasts } from 'react-toast-notifications';
import TOAST_APPEARANCES from '../../../constants/toastAppearances';
import PortfolioDashboard from '../../organisms/PortfolioDashboard';
import LoadingIndicator from '../../molecules/LoadingIndicator';

const PortfolioPage = ({
  currentUser,
  currentUserStaticPortfolio,
  onStaticPortfolioFetched,
}) => {
  const { addToast } = useToasts();
  const { portfolio_owner_uid: portfolioOwnerUid } = useParams();
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [localStaticPortfolio, setLocalStaticPortfolio] = useState([]);
  const [dynamicPortfolio, setDynamicPortfolio] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total: 0,
    return: 0,
    earningsRate: 0,
  });
  const [portfolioItemToEdit, setPortfolioItemToEdit] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [submitType, setSubmitType] = useState('new');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaticPortfolio = async () => {
      const staticPortfolioResponse = await requestPortfolio(portfolioOwnerUid);
      setLocalStaticPortfolio(staticPortfolioResponse.portfolio);
    };

    fetchStaticPortfolio();
    setIsLoading(true);
  }, [currentUserStaticPortfolio]);

  useEffect(() => {
    if (!localStaticPortfolio.length) {
      setDynamicPortfolio([]);
      setDashboardData({
        total: 0,
        return: 0,
        earningsRate: 0,
      });
      setChartData([]);
      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    const setPortfolioPageData = async () => {
      const portfolioWithRealPrice = await concatRealPrice(localStaticPortfolio);

      setDynamicPortfolio(portfolioWithRealPrice);

      const updatedDashboardData = {
        total: 0,
        return: 0,
        earningsRate: 0,
      };
      let originalCapital = 0;

      portfolioWithRealPrice.forEach(portfolioItem => {
        const { price, avgPrice, quantity } = portfolioItem;

        updatedDashboardData.total
          = new Decimal(price)
            .times(new Decimal(quantity))
            .plus(new Decimal(updatedDashboardData.total))
            .toDecimalPlaces(2)
            .toString();
        updatedDashboardData.return
          = new Decimal(price)
            .minus(new Decimal(avgPrice))
            .times(new Decimal(quantity))
            .plus(new Decimal(updatedDashboardData.return))
            .toDecimalPlaces(2)
            .toString();
        originalCapital
          = new Decimal(avgPrice)
            .times(new Decimal(quantity))
            .plus(new Decimal(originalCapital))
            .toDecimalPlaces(2)
            .toString();
      });

      updatedDashboardData.earningsRate
        = new Decimal(updatedDashboardData.return)
          .dividedBy(new Decimal(originalCapital))
          .times(100)
          .toDecimalPlaces(2)
          .toString();

      setDashboardData({
        total: updatedDashboardData.total,
        return: updatedDashboardData.return,
        earningsRate: updatedDashboardData.earningsRate,
      });
    };

    setPortfolioPageData();
  }, [localStaticPortfolio]);

  useEffect(() => {
    if (!dynamicPortfolio.length || !dashboardData.total) return;

    const portfolioByProportions
      = calculateProportions(dynamicPortfolio, dashboardData.total);

    setChartData(portfolioByProportions);
    setIsLoading(false);
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
    setSubmitType('update');
  };

  const deleteClickHandler = async portfolioItemId => {
    const confirm = window.confirm('삭제하시겠습니까?');

    if (!confirm) return;

    const deleteResponse = await requestPortfolioItemDelete(currentUser.uid, portfolioItemId);

    if (deleteResponse.result !== 'ok') {
      addToast('삭제하다가 문제가 생겼어요', {
        appearance: TOAST_APPEARANCES.ERROR,
        autoDismiss: true,
      });

      return;
    }

    const fetchStaticPortfolio = async () => {
      const staticPortfolioResponse = await requestPortfolio(currentUser.uid);

      onStaticPortfolioFetched(staticPortfolioResponse.portfolio);
    };

    fetchStaticPortfolio();
  };

  return (
    <>
      <div className='portfolio_page_wrapper'>
        {
          localStaticPortfolio.length
            ? <div className='graphs_wrapper'>
              {
                isLoading
                  ? <LoadingIndicator />
                  : <CircleChart
                    data={chartData}
                    type='pie'
                    category='portfolioDashboard'
                  />
              }
            </div>
            : <div className='comment_wrapper' onClick={createClickHandler}>
              <h3>주식을 등록하고 포트폴리오를 관리하세요</h3>
            </div>
        }
        {
          currentUser.uid === portfolioOwnerUid
          && <PortfolioDashboard
            total={dashboardData.total}
            earnings={dashboardData.return}
            earningsRate={dashboardData.earningsRate}
          />
        }
        <div className='table_wrapper'>
          <div className='table_header'>
            <h3>주식 목록</h3>
            {
              currentUser.uid === portfolioOwnerUid
              && <Button onClick={createClickHandler}>
                <AddIcon className='portfolio_item_create_button' />
              </Button>
            }
          </div>
          <table className='table'>
            <tbody>
              <tr>
                <th>기업</th>
                {
                  currentUser.uid === portfolioOwnerUid
                  && <>
                    <th>보유량</th>
                    <th>평단가</th>
                  </>
                }
                <th>현재가</th>
                {
                  currentUser.uid === portfolioOwnerUid
                  && <>
                    <th>손익</th>
                    <th>수익률</th>
                    <th>평가금액</th>
                    <th>매입금액</th>
                    <th>수정</th>
                    <th>삭제</th>
                  </>
                }
              </tr>
              {
                dynamicPortfolio.map(item => {
                  const { id, symbol, quantity, avgPrice, price } = item;
                  return (
                    <tr key={id}>
                      <td className='table_symbol'>
                        {
                          <Link to={`/stock_details/${symbol}`}>
                            {symbol}
                          </Link>
                        }
                      </td>
                      {
                        currentUser.uid === portfolioOwnerUid
                        && <>
                          <td className='table_quantity'>{`${commaNumber(quantity)}주`}</td>
                          <td className='table_avg_price'>{`$${commaNumber(avgPrice)}`}</td>
                        </>
                      }
                      <td className='table_price'>
                        {`$${commaNumber(new Decimal(price).toDecimalPlaces(2).toString())}`}
                      </td>
                      {
                        currentUser.uid === portfolioOwnerUid
                        && <>
                          <td className='table_return'>
                            {
                              commaNumber(new Decimal(price).minus(new Decimal(avgPrice)).times(new Decimal(quantity)).toDecimalPlaces(2).toString()) < 0
                                ? `-$${Math.abs(commaNumber(new Decimal(price).minus(new Decimal(avgPrice)).times(new Decimal(quantity)).toDecimalPlaces(2)))}`
                                : `$${commaNumber(new Decimal(price).minus(new Decimal(avgPrice)).times(new Decimal(quantity)).toDecimalPlaces(2).toString())}`
                            }
                          </td>
                          <td className='table_earnings_rate'>{`${commaNumber((new Decimal(price).dividedBy(new Decimal(avgPrice))).minus(1).times(100).toDecimalPlaces(2).toString())}%`}</td>
                          <td className='table_current_total'>{`$${commaNumber(new Decimal(price).times(new Decimal(quantity)).toDecimalPlaces(2).toString())}`}</td>
                          <td className='table_buying_total'>{`$${commaNumber(new Decimal(avgPrice).times(new Decimal(quantity)).toDecimalPlaces(2).toString())}`}</td>
                          <td className='table_update'>
                            <Button
                              className='portfolio_item_edit_button'
                              onClick={editClickHandler.bind(null, id, symbol, quantity, avgPrice)}
                            >
                              <EditOutlinedIcon />
                            </Button>
                          </td>
                          <td className='table_remove'>
                            <Button
                              className='portfolio_item_remove_button'
                              onClick={deleteClickHandler.bind(null, id)}
                            >
                              <ClearRoundedIcon />
                            </Button>
                          </td>
                        </>
                      }
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
          staticPortfolio={currentUserStaticPortfolio}
          onStaticPortfolioFetched={onStaticPortfolioFetched}
          submitType={submitType}
          setSubmitType={setSubmitType}
        />
      }
    </>
  );
};
export default PortfolioPage;
