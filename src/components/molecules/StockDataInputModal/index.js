import React, { useState } from 'react';
import Modal from '../../atoms/Modal';
import ModalOverlay from '../../atoms/ModalOverlay';
import Button from '../../atoms/Button';
import requestStockDataUpdate from '../../../api/requestStockDataUpdate';

const StockDataInputModal = ({ currentUser, setIsInputModalOpen }) => {
  const [symbol, setSymbol] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const StockDataSumbitHandler = async () => {
    const stockData = {
      symbol,
      avgPrice,
      quantity,
    };

    const response = await requestStockDataUpdate(currentUser, stockData);
  };

  return (
    <>
      <ModalOverlay setIsModalOpen={setIsInputModalOpen} />
      <Modal className='stockDataInputModal'>
        <div>
          <h3>티커</h3>
          <input
            type='text'
            value={symbol}
            onChange={event => setSymbol(event.target.value)}
          />
        </div>
        <div>
          <h3>평균단가</h3>
          <input
            type='text'
            value={avgPrice}
            onChange={event => setAvgPrice(event.target.value)}
          />
        </div>
        <div>
          <h3>보유 수량</h3>
          <input
            type='text'
            value={quantity}
            onChange={event => setQuantity(event.target.value)}
          />
        </div>
        <Button
          className='stockDataSumbitButton'
          onClick={StockDataSumbitHandler}
          text='확인'
        />
      </Modal>
    </>
  );
};

export default StockDataInputModal;
