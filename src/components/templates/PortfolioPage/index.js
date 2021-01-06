import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioItemInputModal from '../../molecules/PortfolioItemInputModal';
import { Decimal } from 'decimal.js';
import requestPortfolioItemDelete from '../../../api/requestPortfolioItemDelete';
import concatRealPrice from '../../../utils/concatRealPrice';
import CircleChart from '../../molecules/CircleChart';
import calculateProportions from '../../../utils/calculateProportions';
import fetchPortfolio from '../../../api/fetchPortfolio';
import { useToasts } from 'react-toast-notifications';
import TOAST_APPEARANCES from '../../../constants/toastAppearances';
import PortfolioDashboard from '../../organisms/PortfolioDashboard';
import LoadingIndicator from '../../molecules/LoadingIndicator';
import PortfolioTable from '../../organisms/PortfolioTable';

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
      const staticPortfolioResponse = await fetchPortfolio(portfolioOwnerUid);
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
      const staticPortfolioResponse = await fetchPortfolio(currentUser.uid);
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
        <div className='portfolio_table_wrapper'>
          <PortfolioTable
            currentUser={currentUser}
            portfolioOwnerUid={portfolioOwnerUid}
            portfolio={dynamicPortfolio}
            onCreateButtonClick={createClickHandler}
            onEditButtonClick={editClickHandler}
            onDeleteButtonClick={deleteClickHandler}
          />
        </div>
      </div >
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
