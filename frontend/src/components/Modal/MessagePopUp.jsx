import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Button from '../Button/Button';

const MessagePopup = ({ type = 'confirm', title, message, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-primary-shade1/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm relative p-6 text-center">
        {type === 'confirm' && (
          <>
            <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black">
              <IoClose size={20} />
            </button>
            <p className="text-lg font-semibold mb-4">{title}</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={onConfirm}
                variant="primary"
                size="small"
                label="Lanjutkan"
              />
              <Button
                onClick={onClose}
                variant="secondary"
                size="small"
                label="Batal"
              />
            </div>
          </>
        )}

        {type === 'success' && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="font-bold text-xl text-green-700">Sukses!</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            <div className="flex justify-center mt-4">
              <Button
                onClick={onClose}
                variant="primary"
                size="small"
                label="OK"
              />
            </div>
          </>
        )}

        {type === 'error' && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <h3 className="font-bold text-xl text-red-700">Gagal!</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            <div className="flex justify-center mt-4">
              <Button
                onClick={onClose}
                variant="primary"
                size="small"
                label="OK"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagePopup;