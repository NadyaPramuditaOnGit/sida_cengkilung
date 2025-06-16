// src/App.jsx
import React, { useState } from 'react';
import InputField from './components/InputField/InputField';
import Button from './components/Button/Button';
import { RiLoginBoxLine } from '@remixicon/react';

function App() {
  // Tambahkan state untuk menyimpan nilai input
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi submit (sementara hanya console.log)
  const handleLogin = () => {
    console.log('Nama:', nama);
    console.log('Password:', password);
    // Tambahkan validasi atau API call di sini
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md font-roboto">
        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

        <div className="mb-4">
          <InputField
            title="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            type="text"
            value={nama}
            onChange={setNama}
          />
        </div>

        <div className="mb-4">
          <InputField
            title="Password"
            placeholder="Masukkan password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <div className="mt-6">
          <Button
            size="small"
            label="Login"
            rightIcon='RiLoginBoxLine'
            onClick={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}

export default App;