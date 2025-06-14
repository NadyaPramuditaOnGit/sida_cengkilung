import { useState } from 'react';

const Checkbox = ({ label, disabled }) => {
  const [checked, setChecked] = useState(false);
  const customShadow = {
    boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.25)"
  };

  const toggleCheckbox = () => {
    if (!disabled) setChecked(!checked);
  };

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer w-max p-2 rounded-md transition-colors duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:bg-gray-200'}
      `}
      onClick={toggleCheckbox}
    >
      <div
        style={customShadow}
        className={`w-11 h-11 border-2 rounded flex items-center justify-center transition-all duration-300 ease-in-out
          ${disabled ? 'bg-gray-300 border-gray-300' : 
            checked ? 'bg-blue-500 border-blue-500' : 'bg-white'}
        `}
      >
        {checked && (
          <div className={`
            w-4 h-4 bg-white transform transition-all duration-300 ease-in-out
            ${!disabled ? 'scale-100' : 'scale-90 opacity-70'}
          `}
          style={{
            clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)'
          }}
          />
        )}
      </div>
      {label && (
        <span
          className={`text-lg font-roboto transition-colors duration-200
            ${disabled ? 'text-gray-500' : checked ? 'text-blue-600' : 'text-black'}
          `}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Checkbox;