import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className='loading_indicator_wrapper'>
      <div className='loading_indicator'>
        <div className='v-bar first'></div>
        <div className='v-bar second'></div>
        <div className='v-bar third'></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
