import React, { useState } from 'react'; 
import { } from "@remixicon/react";
import RadioButton from './components/Button/RadioButton.jsx';


function App() {
  const [mediaType, setMediaType] = useState('foto');

  const mediaOptions = [
    { value: 'foto', label: 'Foto' },
    { value: 'video', label: 'Video' },
  ];

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Media</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Pilih Jenis Media:</h2>
        <RadioButton
          options={mediaOptions}
          name="mediaType"
          defaultValue={mediaType}
          onChange={(value) => setMediaType(value)}
        />
      </div>

      {/* Form upload berdasarkan pilihan */}
      {mediaType === 'foto' ? (
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-3">Upload Foto</h3>
          <input 
            type="file" 
            accept="image/*" 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      ) : (
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-3">Upload Video</h3>
          <input 
            type="file" 
            accept="video/*" 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p>Media yang dipilih: <span className="font-medium capitalize">{mediaType}</span></p>
      </div>
    </div>
  );
}

export default App;