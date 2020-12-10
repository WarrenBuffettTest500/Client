import React, { useState } from 'react';
import Modal from '../../atoms/Modal';
import ModalOverlay from '../../atoms/ModalOverlay';
import Button from '../../atoms/Button';
import requestPortfolioItemCreate from '../../../api/requestPortfolioItemCreate';
import requestPortfolioItemUpdate from '../../../api/requestPortfolioItemUpdate';

const PortfolioItemInputModal = ({
  currentUser,
  portfolioItemToEdit,
  setIsInputModalOpen,
  setPortfolioItemToEdit,
}) => {
  const [symbol, setSymbol] = useState(portfolioItemToEdit?.symbol || '');
  const [avgPrice, setAvgPrice] = useState(portfolioItemToEdit?.avgPrice || '');
  const [quantity, setQuantity] = useState(portfolioItemToEdit?.quantity || '');

  const portfolioItemSumbitHandler = async () => {
    const portfolioItem = {
      symbol,
      avgPrice,
      quantity,
    };

    const response
      = portfolioItemToEdit
        ? await requestPortfolioItemUpdate(currentUser, portfolioItem, portfolioItemToEdit.portfolioItemId)
        : await requestPortfolioItemCreate(currentUser, portfolioItem);

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
      <Modal className='portfolioItemInputModal'>
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
          className='portfolioItemSumbitButton'
          onClick={portfolioItemSumbitHandler}
          text='확인'
        />
      </Modal>
    </>
  );
};

export default PortfolioItemInputModal;
