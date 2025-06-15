import React, { useState, useEffect } from 'react';
import { } from '@remixicon/react';

const InputField = ({
  title = "",
  placeholder = "",
  value = "",
  onChange = () => {},
  size = "large", // "large" | "small"
  state = "default", // "default" | "highlight" | "error" | "warning" | "success" | "disabled"
  iconPosition = "none", // "left" | "right" | "none"
  showIcon = false,
  helpText = "",
  showHelpText = false,
  type = "text", // "text" | "file"
  className = "",
  name = "",
  required = false,
  validate = () => true // Function to validate input
}) => {
  const [fileName, setFileName] = useState("");
  const [inputState, setInputState] = useState(state);

  useEffect(() => {
    if (validate(value)) {
      setInputState("success");
    } else if (value) {
      setInputState("error");
    } else {
      setInputState("default");
    }
  }, [value, validate]);

  // Styling functions
  const getStateClasses = () => {
    const baseClasses = "bg-white rounded-sm border border-gray-300 focus:border-blue-500 transition-all duration-200 font-['Roboto'] shadow-[0px_5px_5px_rgba(0,0,0,0.25)]";
    
    switch (inputState) {
      case "highlight":
        return `${baseClasses} outline outline-2 outline-offset-[-2px] outline-blue-400`;
      case "error":
        return `${baseClasses} border-red-500`;
      case "warning":
        return `${baseClasses} border-yellow-500`;
      case "success":
        return `${baseClasses} border-green-500`;
      case "disabled":
        return `${baseClasses} opacity-60 cursor-not-allowed`;
      default:
        return baseClasses;
    }
  };

  const getTitleColor = () => inputState === "disabled" ? "text-gray-500" : "text-gray-800";
  const getPlaceholderColor = () => inputState === "disabled" ? "text-gray-400" : "text-gray-500";
  const getIconColor = () => inputState === "disabled" ? "text-gray-400" : "text-gray-800";

  const getSizeClasses = () => size === "large" ? "px-4 py-2 text-base" : "px-3 py-1.5 text-sm";
  const getTitleSizeClass = () => size === "large" ? "text-base font-bold" : "text-sm font-bold";
  const getHelpTextSizeClass = () => size === "large" ? "text-sm font-normal" : "text-xs font-normal";

  const getStateIcon = () => {
    switch (inputState) {
      case "error": return <i className="ri-error-warning-line text-red-500 text-base"></i>;
      case "warning": return <i className="ri-alert-line text-yellow-500 text-base"></i>;
      case "success": return <i className="ri-checkbox-circle-line text-green-500 text-base"></i>;
      default: return null;
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  // Render icon
  const renderIcon = () => {
    if (!showIcon || iconPosition === "none") return null;
    
    const iconClass = `flex items-center ${getIconColor()}`;
    
    if (type === "file") {
      return (
        <div className={iconClass}>
          <i className="ri-upload-cloud-line text-lg"></i>
        </div>
      );
    }
    
    return (
      <div className={iconClass}>
        {iconPosition === "left" ? (
          <i className="ri-arrow-left-s-line text-lg"></i>
        ) : (
          <i className="ri-arrow-right-s-line text-lg"></i>
        )}
      </div>
    );
  };

  // Render input content
  const renderInputContent = () => {
    const inputClasses = `w-full bg-transparent outline-none ${getPlaceholderColor()} ${
      size === 'large' ? 'text-base' : 'text-sm'
    } font-normal font-['Roboto']`;
    
    if (type === "file") {
      return (
        <div className="relative w-full">
          <input
            type="file"
            id={name}
            name={name}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={inputState === 'disabled'}
          />
          <label 
            htmlFor={name} 
            className={`${inputClasses} cursor-pointer block truncate ${fileName ? 'text-gray-800' : getPlaceholderColor()}`}
          >
            {fileName || placeholder}
          </label>
        </div>
      );
    }
    
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
        disabled={inputState === 'disabled'}
        required={required}
      />
    );
  };

  return (
    <div className={`w-full flex flex-col items-start gap-1 ${className}`}>
      {/* Title - only shown if provided */}
      {title && (
        <label className={`${getTitleColor()} ${getTitleSizeClass()} font-['Roboto']`}>
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className={`w-full ${getSizeClasses()} ${getStateClasses()} flex items-center ${
        iconPosition === 'left' ? 'gap-3' : iconPosition === 'right' ? 'gap-3' : ''
      }`}>
        {/* Left Icon */}
        {iconPosition === "left" && renderIcon()}
        
        {/* Input Content */}
        {renderInputContent()}
        
        {/* Right Icon */}
        {iconPosition === "right" && renderIcon()}
      </div>
      
      {/* Help Text - only shown if provided and showHelpText is true */}
      {showHelpText && helpText && (
        <div className={`flex items-center gap-1 ${getHelpTextSizeClass()} ${getPlaceholderColor()}`}>
          {getStateIcon()}
          <span className="font-['Roboto']">{helpText}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;