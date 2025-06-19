import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const MessagePopup = ({ type = 'confirm', title, message, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm relative p-6 text-center">
        {type === 'confirm' && (
          <>
            <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black">
              <IoClose size={20} />
            </button>
            <p className="text-lg font-semibold mb-4">{title}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                className="px-4 py-1 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700"
              >
                Lanjutkan
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-100"
              >
                Batal
              </button>
            </div>
          </>
        )}

        {type === 'success' && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="font-bold text-xl text-green-700">Sukses!</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            >
              OK
            </button>
          </>
        )}

        {type === 'error' && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <h3 className="font-bold text-xl text-red-700">Gagal!</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            >
              OK
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagePopup;