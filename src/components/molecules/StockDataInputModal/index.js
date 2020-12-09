import React, { useState } from 'react';
import Modal from '../../atoms/Modal';
import ModalOverlay from '../../atoms/ModalOverlay';
import Button from '../../atoms/Button';
import requestPortfolioItemCreate from '../../../api/requestPortfolioItemCreate';
import requestPortfolioItemUpdate from '../../../api/requestPortfolioItemUpdate';

const StockDataInputModal = ({
  currentUser,
  portfolioItemToEdit,
  setIsInputModalOpen,
  setPortfolioItemToEdit,
}) => {
  const [symbol, setSymbol] = useState(portfolioItemToEdit?.symbol || '');
  const [avgPrice, setAvgPrice] = useState(portfolioItemToEdit?.avgPrice || '');
  const [quantity, setQuantity] = useState(portfolioItemToEdit?.quantity || '');

  const StockDataSumbitHandler = async () => {
    const stockData = {
      symbol,
      avgPrice,
      quantity,
    };

    const response
      = portfolioItemToEdit
        ? await requestPortfolioItemUpdate(currentUser, stockData, portfolioItemToEdit.portfolioItemId)
        : await requestPortfolioItemCreate(currentUser, stockData);

    if (response.result !== 'ok') {
      alert('실패');

      return;
    }

    alert('성공');

    setPortfolioItemToEdit(null);
    setIsInputModalOpen(false);
  };

  return (
    <>
      <ModalOverlay
        setIsModalOpen={setIsInputModalOpen}
        onClick={() => setPortfolioItemToEdit(null)}
      />
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
