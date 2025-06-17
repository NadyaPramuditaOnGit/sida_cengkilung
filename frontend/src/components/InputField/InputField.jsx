import React, { useState, useEffect, useCallback } from 'react';
import {
  RiUploadCloudLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiCheckboxCircleLine,
} from '@remixicon/react';

const InputField = ({
  title = "",
  placeholder = "",
  value = "",
  onChange = () => {},
  size = "large",
  state = "default",
  iconPosition = "none",
  showIcon = false,
  customIcon = null,
  helpText = "",
  showHelpText = false,
  type = "text", 
  className = "",
  name = "",
  required = false,
  validationRules = null,
  onFocus = () => {},
  onBlur = () => {},
  enabled = true,
  iconEnabled = true,
}) => {
  const [fileName, setFileName] = useState("");
  const [inputState, setInputState] = useState(state);
  const [isFocused, setIsFocused] = useState(false);

  const validateInput = useCallback((val) => {
    if (!validationRules) return true;

    if (validationRules.required && !val) return false;
    if (validationRules.minLength && val?.length < validationRules.minLength) return false;
    if (validationRules.maxLength && val?.length > validationRules.maxLength) return false;
    if (validationRules.pattern && !validationRules.pattern.test(val)) return false;

    return true;
  }, [validationRules]);

  useEffect(() => {
    if (!enabled || state === 'disabled') {
      setInputState('disabled');
      return;
    }

    if (!value && value !== 0) { // Handle 0 as valid value
      setInputState('default');
      return;
    }

    if (validateInput(value)) {
      setInputState('success');
    } else {
      setInputState('error');
    }
  }, [value, state, validateInput, enabled]);

  const getStateClasses = () => {
    const baseClasses = "rounded-sm transition-all duration-300 font-['Roboto'] shadow-[0px_5px_5px_rgba(0,0,0,0.25)]";

    if (!enabled || inputState === 'disabled') {
      return `${baseClasses} border border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed`;
    }

    switch (inputState) {
      case "error":
        return `${baseClasses} border-2 border-red-500 bg-red-50`;
      case "warning":
        return `${baseClasses} border-2 border-yellow-500 bg-yellow-50`;
      case "success":
        return `${baseClasses} border-2 border-green-500 bg-green-50`;
      default:
        return isFocused 
          ? `${baseClasses} border-2 border-blue-500 bg-blue-50` 
          : `${baseClasses} border border-gray-300 bg-white`;
    }
  };

  const getStateIcon = () => {
    if (!enabled) return null;
    
    switch (inputState) {
      case "error": return <RiErrorWarningLine size={16} className="text-red-500" />;
      case "warning": return <RiAlertLine size={16} className="text-yellow-500" />;
      case "success": return <RiCheckboxCircleLine size={16} className="text-green-500" />;
      default: return null;
    }
  };

  const handleFileChange = (e) => {
    if (!enabled) return;
    
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  const handleInputChange = (e) => {
    if (!enabled) return;
    onChange(e.target.value);
  };

  const renderIcon = () => {
    if (!showIcon || iconPosition === "none" || !iconEnabled) return null;

    const iconClass = `flex items-center ${(!enabled || inputState === "disabled") ? "text-gray-400" : "text-gray-800"}`;

    if (customIcon) {
      return (
        <div className={iconClass}>
          {React.cloneElement(customIcon, {
            size: 20,
            className: `${customIcon.props.className || ''} ${(!enabled || inputState === "disabled") ? "text-gray-400" : "text-gray-800"}`
          })}
        </div>
      );
    }

    if (type === "file") {
      return (
        <div className={iconClass}>
          <RiUploadCloudLine size={20} />
        </div>
      );
    }

    return null;
  };

  const renderInputContent = () => {
    const inputClasses = `w-full bg-transparent outline-none ${
      (!enabled || inputState === "disabled") ? "text-gray-400" : "text-gray-800"
    } ${size === 'large' ? 'text-base' : 'text-sm'} font-normal font-['Roboto']`;

    if (type === "file") {
      return (
        <div className="relative w-full">
          <input
            type="file"
            id={name}
            name={name}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={!enabled || inputState === 'disabled'}
          />
          <label htmlFor={name} className={`${inputClasses} cursor-pointer block truncate`}>
            {fileName || placeholder || `Masukan ${title.toLowerCase()}`}
          </label>
        </div>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={handleInputChange}
        placeholder={placeholder || `Masukan ${title.toLowerCase()}`}
        className={inputClasses}
        disabled={!enabled || inputState === 'disabled'}
        required={required && enabled}
        onFocus={(e) => {
          if (enabled) {
            setIsFocused(true);
            onFocus(e);
          }
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur(e);
        }}
      />
    );
  };

  const getTitleColor = () => {
    if (!enabled || inputState === 'disabled') return "text-gray-500";
    switch (inputState) {
      case "error": return "text-red-600";
      case "warning": return "text-yellow-600";
      case "success": return "text-green-600";
      default: return "text-gray-800";
    }
  };

  const getTitleSizeClass = () => size === "large" ? "text-base font-bold" : "text-sm font-bold";
  const getHelpTextSizeClass = () => size === "large" ? "text-sm font-normal" : "text-xs font-normal";

  return (
    <div className={`w-full flex flex-col items-start gap-1 ${className}`}>
      {title && (
        <label className={`${getTitleColor()} ${getTitleSizeClass()} font-['Roboto']`}>
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={`w-full ${
        size === "large" ? "px-4 py-2 text-base" : "px-3 py-1.5 text-sm"
      } ${getStateClasses()} flex items-center ${
        iconPosition === 'left' || iconPosition === 'right' ? 'gap-3' : ''
      }`}>
        {iconPosition === "left" && renderIcon()}
        {renderInputContent()}
        {iconPosition === "right" && renderIcon()}
        {enabled && inputState !== 'default' && inputState !== 'disabled' && (
          <div className="ml-2">
            {getStateIcon()}
          </div>
        )}
      </div>

      {showHelpText && helpText && (
        <div className={`flex items-center gap-1 ${getHelpTextSizeClass()} ${
          inputState === 'error' ? 'text-red-500' :
          inputState === 'warning' ? 'text-yellow-500' :
          inputState === 'success' ? 'text-green-500' :
          'text-gray-500'
        }`}>
          {getStateIcon()}
          <span className="font-['Roboto']">{helpText}</span>
        </div>
      )}

      {validationRules && inputState === 'error' && enabled && (
        <div className={`text-red-500 ${getHelpTextSizeClass()} font-['Roboto']`}>
          {validationRules.message || 'Input tidak valid'}
        </div>
      )}
    </div>
  );
};

export default InputField;