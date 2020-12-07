import React, { useState, useEffect } from 'react';
import './index.scss';
import StockDataInputModal from '../../components/molecules/StockDataInputModal';

const MyPage = ({ currentUser }) => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  useEffect(() => {

  }, []);

  const clickHandler = () => {
    setIsInputModalOpen(true);
  };

  return (
    <>
      <div className='myPageWrapper'>
        <div className='graphsWrapper'></div>
        <div className='dashboardWrapper'></div>
        <div className='tableWrapper'>
          <div className='tableTitle'>

          </div>
        </div>
        <button onClick={clickHandler}>더하기</button>
      </div>
      {
        isInputModalOpen
        && <StockDataInputModal currentUser={currentUser} setIsInputModalOpen={setIsInputModalOpen} />
      }
    </>
  );
};

export default MyPage;
