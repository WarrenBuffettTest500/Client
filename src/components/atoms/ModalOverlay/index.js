import React from 'react';

const ModalOverlay = ({ setIsModalOpen }) => {
  return (
    <div
      className='modal_overlay'
      onClick={() => setIsModalOpen(false)}
    />
  );
};

export default ModalOverlay;
