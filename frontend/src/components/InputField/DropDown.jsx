import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';

const SelectField = ({
  title = "",
  placeholder = "Select an option",
  value = "",
  onChange = () => {},
  options = [],
  size = "large",
  disabled = false,
  iconPosition = "right",
  showIcon = true,
  helpText = "",
  showHelpText = false,
  className = "",
  name = "",
  required = false,
  customIcon = null, 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getStateClasses = () => {
    const baseClasses = `bg-white rounded-sm transition-all duration-200 font-['Roboto'] shadow-[0px_5px_5px_rgba(0,0,0,0.25)]`;
    
    if (disabled) {
      return `${baseClasses} border border-gray-300 opacity-60 cursor-not-allowed`;
    }
    
    if (isFocused || isOpen) {
      return `${baseClasses} bg-blue-50 bg-opacity-50 border border-blue-300`;
    }
    
    if (isHovered) {
      return `${baseClasses} bg-gray-100 bg-opacity-50 border border-gray-300`;
    }
    
    return `${baseClasses} border border-gray-300`;
  };

  const getTitleColor = () => disabled ? "text-gray-500" : "text-gray-800";
  const getPlaceholderColor = () => disabled ? "text-gray-400" : "text-gray-500";
  const getIconColor = () => disabled ? "text-gray-400" : "text-gray-600";

  const getSizeClasses = () => size === "large" ? "px-4 py-2 text-base" : "px-3 py-1.5 text-sm";
  const getTitleSizeClass = () => size === "large" ? "text-base font-bold" : "text-sm font-bold";
  const getHelpTextSizeClass = () => size === "large" ? "text-sm font-normal" : "text-xs font-normal";

   const renderIcon = () => {
    if (!showIcon || iconPosition === "none") return null;
    
    const iconClass = `flex items-center ${getIconColor()}`;
    
    return (
      <div className={iconClass}>
        {customIcon ? customIcon({ isOpen }) : (
          isOpen ? <RiArrowUpSLine size={20} /> : <RiArrowDownSLine size={20} />
        )}
      </div>
    );
  };

  const getSelectedLabel = () => {
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const handleOptionClick = (optionValue) => {
    if (!disabled) {
      onChange(optionValue);
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  return (
    <div 
      className={`w-full flex flex-col items-start gap-1 relative ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title - only shown if provided */}
      {title && (
        <label htmlFor={name} className={`${getTitleColor()} ${getTitleSizeClass()} font-['Roboto']`}>
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select Container */}
      <div 
        id={name}
        className={`w-full ${getSizeClasses()} ${getStateClasses()} flex items-center justify-between ${
          iconPosition === 'left' ? 'gap-3' : iconPosition === 'right' ? 'gap-3' : ''
        } cursor-pointer`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${name}-options`}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        {/* Left Icon */}
        {iconPosition === "left" && renderIcon()}
        
        {/* Selected value or placeholder */}
        <div className={`w-full ${getPlaceholderColor()} ${
          size === 'large' ? 'text-base' : 'text-sm'
        } font-normal font-['Roboto'] truncate ${
          value ? 'text-gray-800' : getPlaceholderColor()
        }`}>
          {getSelectedLabel()}
        </div>
        
        {/* Right Icon */}
        {iconPosition === "right" && renderIcon()}
      </div>
      
      {/* Dropdown options */}
      {isOpen && !disabled && (
        <div 
          id={`${name}-options`}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg top-full max-h-60 overflow-auto"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-800'
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      
      {/* Help Text - only shown if provided and showHelpText is true */}
      {showHelpText && helpText && (
        <div className={`flex items-center gap-1 ${getHelpTextSizeClass()} text-gray-500`}>
          <span className="font-['Roboto']">{helpText}</span>
        </div>
      )}
    </div>
  );
};

export default SelectField;