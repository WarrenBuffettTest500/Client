import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className='loading_indicator_wrapper'>
      <div className='loading_indicator'>
        <div className='v_bar first'></div>
        <div className='v_bar second'></div>
        <div className='v_bar third'></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
