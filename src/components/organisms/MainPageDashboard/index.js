import React from 'react';
import Card from '../../atoms/Card';
import CircleChart from '../../molecules/CircleChart';
import LoadingIndicator from '../../molecules/LoadingIndicator';
import TrendingList from '../../molecules/TrendingList';

const MainPageDashboard = ({
  currentUser,
  isLoadingPortfolio,
  staticPortfolio,
  onPortfolioClick,
  chartData,
  total,
  trendingStocks,
}) => {
  const portfolioClickHandler = () => {
    onPortfolioClick();
  };

  return (
    <div className='main_page_dashboard_wrapper'>
      {
        currentUser
          ? <Card className='my_portfolio_card'>
            {
              isLoadingPortfolio
                ? <LoadingIndicator />
                : (
                  staticPortfolio.length
                    ? <div
                      className='circle_chart_wrapper mychart'
                      onClick={portfolioClickHandler}
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
                        onClick={portfolioClickHandler}
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
              onClick={portfolioClickHandler}
              className='card_message'
            >
              먼저 로그인해 주세요
             </div>
          </Card>
      }
      <TrendingList symbols={trendingStocks} />
    </div>
  );
};

export default MainPageDashboard;
