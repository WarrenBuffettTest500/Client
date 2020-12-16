import React, { useState } from 'react';
import Modal from '../../atoms/Modal';
import ModalOverlay from '../../atoms/ModalOverlay';
import Button from '../../atoms/Button';
import requestPortfolioItemCreate from '../../../api/requestPortfolioItemCreate';
import requestPortfolioItemUpdate from '../../../api/requestPortfolioItemUpdate';
import requestPortfolio from '../../../api/requestPortfolio';
import { useToasts } from 'react-toast-notifications';

const PortfolioItemInputModal = ({
  currentUser,
  portfolioItemToEdit,
  setIsInputModalOpen,
  setPortfolioItemToEdit,
  staticPortfolio,
  onStaticPortfolioFetched,
  submitType,
  setSubmitType,
}) => {
  const { addToast } = useToasts();
  const [symbol, setSymbol] = useState(portfolioItemToEdit?.symbol || '');
  const [avgPrice, setAvgPrice] = useState(portfolioItemToEdit?.avgPrice || '');
  const [quantity, setQuantity] = useState(portfolioItemToEdit?.quantity || '');

  const portfolioItemSumbitHandler = async () => {
    if (!symbol || !avgPrice || !quantity) {
      addToast('정보를 모두 입력해 주세요', {
        appearance: 'warning',
        autoDismiss: true,
      });

      return;
    }

    if (isNaN(avgPrice) || isNaN(quantity)) {
      addToast('평균단가와 보유수량은 모두 숫자로 입력해야 합니다', {
        appearance: 'warning',
        autoDismiss: true,
      });

      return;
    }

    let hasItemInPortfolio = false;

    const portfolioItem = {
      symbol,
      avgPrice,
      quantity,
    };

    if (
      submitType === 'new'
      && staticPortfolio.find(item => item.symbol === portfolioItem.symbol)
    ) {
      addToast(`이미 등록한 정보가 있어요. ${symbol}을 찾아서 수정하세요.`, {
        appearance: 'warning',
        autoDismiss: true,
      });

      return;
    }

    const response
      = portfolioItemToEdit || hasItemInPortfolio
        ? await requestPortfolioItemUpdate(currentUser.uid, portfolioItem, portfolioItemToEdit.portfolioItemId)
        : await requestPortfolioItemCreate(currentUser.uid, portfolioItem);

    if (response.result !== 'ok') {
      addToast('등록하다가 문제가 생겼어요', {
        appearance: 'error',
        autoDismiss: true,
      });

      return;
    }

    const fetchStaticPortfolio = async () => {
      const staticPortfolioResponse = await requestPortfolio(currentUser.uid);

      onStaticPortfolioFetched(staticPortfolioResponse.portfolio);
    };

    fetchStaticPortfolio();

    setPortfolioItemToEdit(null);
    setIsInputModalOpen(false);
    setSubmitType('new');
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
            onChange={event => setSymbol(event.target.value.toUpperCase())}
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
