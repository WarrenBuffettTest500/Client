import React from 'react';

const ModalOverlay = ({ setIsModalOpen }) => {
  return (
    <div
      className='modalOverlay'
      onClick={() => setIsModalOpen(false)}
    />
  );
};

export default ModalOverlay;
