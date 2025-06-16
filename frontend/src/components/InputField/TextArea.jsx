import { useState } from 'react';

const EditableTextArea = ({ 
  label: propLabel = "Deskripsi", // Label default di-set di sini (bisa di-override via prop)
  initialValue = "", 
   
}) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [label, setLabel] = useState(propLabel); // Menggunakan propLabel sebagai initial state
  const [value, setValue] = useState(initialValue);

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };



  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Label yang bisa diedit - tetap muncul tapi default di-set di kode */}
      {isEditingLabel ? (
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          onBlur={() => setIsEditingLabel(false)}
          autoFocus
          className="text-[18px] font-normal font-roboto mb-2 w-full p-2 border-b border-gray-300 focus:border-blue-500 outline-none"
        />
      ) : (
        <h2
          onClick={() => setIsEditingLabel(true)}
          className="text-[18px] font-normal font-roboto mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
        >
          {label}
        </h2>
      )}

      {/* Text area */}
      <textarea
        value={value}
        onChange={handleValueChange}
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-[18px] font-normal font-roboto"
        placeholder="Masukkan deskripsi Anda di sini..."
      />
    </div>
  );
};

export default EditableTextArea;