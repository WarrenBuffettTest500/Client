import React from 'react';
import Button from '../../atoms/Button';

const TabBar = ({ onTabButtonClick }) => {
  return (
    <div>
      <Button
        name='day'
        onClick={onTabButtonClick}
        className='tabbar_button'
        data-api-param='1day'>
        day
      </Button>
      <Button
        name='week'
        onClick={onTabButtonClick}
        className='tabbar_button'
        data-api-param='1week'>
        week
      </Button>
      <Button
        name='month'
        onClick={onTabButtonClick}
        className='tabbar_button'
        data-api-param='1month'>
        month
      </Button>
    </div>
  );
};

export default TabBar;
