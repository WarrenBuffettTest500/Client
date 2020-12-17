import React from 'react';
import { Link } from 'react-router-dom';
import List from '../../atoms/List';

const TrendingList = ({ symbols }) => {
  return (
    <List title='실시간 인기 주식' className='trending_list'>
      {
        symbols.map((symbol, index) => (
          <Link to={`/stock_details/${symbol}`} key={symbol}>
            <div className='trending_list_item'>
              {`${index + 1}. ${symbol}`}
            </div>
          </Link>
        ))
      }
    </List >
  );
};

export default TrendingList;
