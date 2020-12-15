import React from 'react';
import List from '../../atoms/List';

const TrendingList = ({ symbols }) => {
  return (
    <List title='인기 주식 목록'>
      {
        symbols.map(symbol => (
          <div key={symbol}>{symbol}</div>
        ))
      }
    </List>
  );
};

export default TrendingList;
