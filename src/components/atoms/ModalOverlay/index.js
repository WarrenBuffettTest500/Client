import React from 'react';
import './index.scss';

const ModalOverlay = ({ setIsModalOpen }) => {
  return (
    <div
      className='modalOverlay'
      onClick={() => setIsModalOpen(false)}
    />
  );
};

export default ModalOverlay;
