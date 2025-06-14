import { useState } from 'react';

const RadioButtonGroup = ({
  options = [],
  name = 'radio-group',
  defaultValue = null,
  onChange = () => {},
  disabled = false
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (value, optionDisabled = false) => {
    if (disabled || optionDisabled) return;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {options.map((option, index) => (
        <RadioButton
          key={option.value || index}
          name={name}
          value={option.value}
          label={option.label}
          checked={selectedValue === option.value}
          onChange={(val) => handleChange(val, option.disabled)}
          disabled={disabled || option.disabled}
          showLabel={selectedValue === option.value}
        />
      ))}
    </div>
  );
};

const RadioButton = ({
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  showLabel = true
}) => {
  return (
    <label
      className={`flex flex-col items-center gap-2 transition-all duration-200 ease-in-out 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`relative w-[34px] h-[34px] rounded-full transition-all duration-200 
            ${checked ? 'bg-white shadow-lg' : 'bg-gray-200 shadow-md'}
          `}
          style={{
            filter: disabled
              ? 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))'
              : 'drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.25))',
          }}
        >
          {checked && (
            <div className="absolute top-[5px] left-[5px] w-[24px] h-[24px] rounded-full bg-blue-400 transition-all duration-200" />
          )}
        </div>
      </div>
      {showLabel && label && (
        <span className="text-[18px] text-black font-medium select-none">{label}</span>
      )}
    </label>
  );
};

export default RadioButtonGroup;