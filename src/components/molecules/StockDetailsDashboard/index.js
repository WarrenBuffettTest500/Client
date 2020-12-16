import React from 'react';
import Card from '../../atoms/Card';

const StockDetailsDashboard = ({ data }) => {
  return (
    <div className='dashbord'>
      <Card className='dashbord_card'>
        <div className='dashbord_card_left'>
          <div className='dashbord_card_info'>📂{data.sector}</div>
          <div className='dashbord_card_info'>📉{data.industry}</div>
          <a
            className='dashbord_card_info'
            href={data.website}
          >
            🌐{data.website}
          </a>
        </div>
        <div className='dashbord_card_right'>
          <div className='dashbord_card_name'>{data.symbol}</div>
          <div className='dashbord_card_price'>{`$${data.price}`}</div>
        </div>
      </Card>
    </div>
  );
};

export default StockDetailsDashboard;
