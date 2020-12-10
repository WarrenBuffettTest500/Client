import React from 'react';
import Card from '../../molecules/Card';

const ListContainer = ({
  className,
  list,
}) => {
  return (
    <div className={className}>
      {list.map(item =>
        <Card
          key={item['Global Quote']['01. symbol']}
          className='companyCard'>
          <h3>{item['Global Quote']['01. symbol']}</h3>
          <p>{`$${item['Global Quote']['05. price']}`}</p>
          <p>{item['Global Quote']['10. change percent']}</p>
        </Card>)}
    </div>
  );
};

export default ListContainer;
