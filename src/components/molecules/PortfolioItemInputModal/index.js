import React, { useState } from 'react';
import Modal from '../../atoms/Modal';
import ModalOverlay from '../../atoms/ModalOverlay';
import Button from '../../atoms/Button';
import requestPortfolioItemCreate from '../../../api/requestPortfolioItemCreate';
import requestPortfolioItemUpdate from '../../../api/requestPortfolioItemUpdate';
import requestPortfolio from '../../../api/requestPortfolio';
import { useToasts } from 'react-toast-notifications';
import TOAST_APPEARANCES from '../../../constants/toastAppearances';
import { RESPONSE_RESULTS } from '../../../constants/responses';
import ModalInputField from '../ModalInputField';

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
        appearance: TOAST_APPEARANCES.WARNING,
        autoDismiss: true,
      });

      return;
    }

    if (isNaN(avgPrice) || isNaN(quantity)) {
      addToast('평균단가와 보유수량은 모두 숫자로 입력해야 합니다', {
        appearance: TOAST_APPEARANCES.WARNING,
        autoDismiss: true,
      });

      return;
    }

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
        appearance: TOAST_APPEARANCES.WARNING,
        autoDismiss: true,
      });

      return;
    }

    const response
      = portfolioItemToEdit
        ? await requestPortfolioItemUpdate(currentUser.uid, portfolioItem, portfolioItemToEdit.portfolioItemId)
        : await requestPortfolioItemCreate(currentUser.uid, portfolioItem);

    if (response.result !== RESPONSE_RESULTS.OK) {
      addToast('등록하다가 문제가 생겼어요', {
        appearance: TOAST_APPEARANCES.ERROR,
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

  const keyPressHandler = event => {
    if (event.key !== 'Enter') return;

    portfolioItemSumbitHandler();
  };

  return (
    <>
      <ModalOverlay
        setIsModalOpen={setIsInputModalOpen}
        onClick={() => setPortfolioItemToEdit(null)}
      />
      <Modal className='portfolio_item_input_modal'>
        <ModalInputField
          title='티커'
          value={symbol}
          onChange={event => setSymbol(event.target.value.toUpperCase())}
          onKeyPress={keyPressHandler}
        />
        <ModalInputField
          title='평균단가'
          value={avgPrice}
          onChange={event => setAvgPrice(event.target.value)}
          onKeyPress={keyPressHandler}
        />
        <ModalInputField
          title='보유 수량'
          value={quantity}
          onChange={event => setQuantity(event.target.value)}
          onKeyPress={keyPressHandler}
        />
        <Button
          className='portfolio_item_sumbit_button'
          onClick={portfolioItemSumbitHandler}
          text='확인'
        />
      </Modal>
    </>
  );
};

export default PortfolioItemInputModal;
