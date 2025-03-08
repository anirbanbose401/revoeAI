import React, { useState } from 'react';
import styles from '../style';
import { arrowUp } from '../assets';

const GetStarted = ({ openModal }) => {
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const openOptionsModal = () => {
    setIsOptionsModalOpen(true);
  };

  const closeOptionsModal = () => {
    setIsOptionsModalOpen(false);
  };

  return (
    <div className={`${styles.flexCenter} flex-col`}>
      <div
        className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer mb-4`}
        onClick={openOptionsModal}
      >
        <div className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}>
          <div className={`${styles.flexStart} flex-row`}>
            <p className='font-poppins font-medium text-[18px] leading-[23px] mr-2'>
              <span className='text-gradient'>Get</span>
            </p>
            <img src={arrowUp} alt="arrowup" className='w-[23px] h-[23px] object-contain'/>
          </div>
          <p className='font-poppins font-medium text-[18px] leading-[23px]'>
            <span className='text-gradient'>Started</span>
          </p>
        </div>
      </div>

      {/* Options Modal */}
      {isOptionsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#1e1f2a] bg-opacity-50 p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button className="absolute top-0 right-2 text-white text-4xl hover:text-gray-300" onClick={closeOptionsModal}>
              &times;
            </button>
            <div className="flex flex-col items-center">
              <button
                className="w-full py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px] bg-green-500 text-white mb-4"
                onClick={() => {
                  openModal("login");
                  closeOptionsModal();
                }}
              >
                Login
              </button>
              <button
                className="w-full py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px] bg-blue-500 text-white"
                onClick={() => {
                  openModal("signup");
                  closeOptionsModal();
                }}
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStarted;