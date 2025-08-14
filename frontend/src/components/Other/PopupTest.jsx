import React, { useState } from 'react';
import MessagePopup from '../Modal/MessagePopUp';

const PopupTest = () => {
  const [popup, setPopup] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <button
        onClick={() => setPopup('confirm')}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow"
      >
        Tampilkan Konfirmasi
      </button>
      <button
        onClick={() => setPopup('success')}
        className="bg-green-600 text-white px-4 py-2 rounded-md shadow"
      >
        Tampilkan Sukses
      </button>
      <button
        onClick={() => setPopup('error')}
        className="bg-red-600 text-white px-4 py-2 rounded-md shadow"
      >
        Tampilkan Gagal
      </button>

      {popup && (
        <MessagePopup
          type={popup}
          title="Anda yakin untuk melanjutkan proses ini?"
          message={
            popup === 'success'
              ? 'Proses berhasil dilakukan'
              : popup === 'error'
              ? 'Periksa kembali data anda'
              : ''
          }
          onClose={() => setPopup(null)}
          onConfirm={() => {
            alert('Lanjutkan ditekan');
            setPopup(null);
          }}
        />
      )}
    </div>
  );
};

export default PopupTest;