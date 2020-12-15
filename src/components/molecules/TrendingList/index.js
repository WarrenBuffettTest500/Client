import React from 'react';
import List from '../../atoms/List';

const TrendingList = ({ symbols }) => {
  return (
    <List title='실시간 인기 주식'>
      {
        symbols.map((symbol, index) => (
          <div key={symbol}>{`${index + 1}. ${symbol}`}</div>
        ))
      }
    </List>
  );
};

export default TrendingList;
