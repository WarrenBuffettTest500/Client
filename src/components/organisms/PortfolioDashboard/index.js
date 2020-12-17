import React from 'react';
import commaNumber from 'comma-number';

const PortfolioDashboard = ({
  total,
  earnings,
  earningsRate,
}) => {
  return (
    <div className='portfolio_dashboard'>
      <div className='dashboard_asset'>
        <h3>총 자산:</h3>&nbsp;
        <h1>{`$${commaNumber(total)}`}</h1>
      </div>
      <div className='dashboard_return'>
        <h3>수익:</h3>&nbsp;
        <h1>
          {
            Number(earnings) < 0
              ? `-$${commaNumber(Math.abs(earnings))}`
              : `$${commaNumber(earnings)}`
          }
        </h1>
      </div>
      <div className='dashboard_earnings_rate'>
        <h3>수익률:</h3>&nbsp;
        <h1>{`${commaNumber(earningsRate)}%`}</h1>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
