import React from 'react';
import Button from '../../atoms/Button';
import { CANDLESTICK_CHART_TABS, INTERVALS } from '../../../constants/intervals';

const TabBar = ({ onTabButtonClick }) => {
  return (
    <div className='tab_bar'>
      <Button
        name={INTERVALS.DAY}
        onClick={onTabButtonClick}
        className='tab_bar_button'
        data-api-param={CANDLESTICK_CHART_TABS.ONE_DAY}
      >
        day
      </Button>
      <Button
        name={INTERVALS.WEEK}
        onClick={onTabButtonClick}
        className='tab_bar_button'
        data-api-param={CANDLESTICK_CHART_TABS.ONE_WEEK}
      >
        week
      </Button>
      <Button
        name={INTERVALS.MONTH}
        onClick={onTabButtonClick}
        className='tab_bar_button'
        data-api-param={CANDLESTICK_CHART_TABS.ONE_MONTH}
      >
        month
      </Button>
    </div>
  );
};

export default TabBar;
