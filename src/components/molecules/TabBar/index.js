import React from 'react';
import Button from '../../atoms/Button';

const TabBar = ({ onTabButtonClick }) => {
  return (
    <div className='tab_bar'>
      <Button
        name='day'
        onClick={onTabButtonClick}
        className='tab_bar_button'
        data-api-param='1day'
      >
        day
      </Button>
      <Button
        name='week'
        onClick={onTabButtonClick}
        className='tab_bar_button'
        data-api-param='1week'
      >
        week
      </Button>
      <Button
        name='month'
        onClick={onTabButtonClick}
        className='tab_bar_button'
        data-api-param='1month'
      >
        month
      </Button>
    </div>
  );
};

export default TabBar;
