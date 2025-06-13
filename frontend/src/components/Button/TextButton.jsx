import React, { useState } from "react";
import * as RemixIcons from "@remixicon/react";

const TextButton = ({
  size = "md",
  leftIcon,
  rightIcon,
  label,
  disabled = false,
  onClick,
  className = "",
  fullWidth = false,
}) => {
  const [buttonState, setButtonState] = useState("default");

  // Size classes
  const sizeClasses = {
    xs: "text-[14px] px-3 py-1.5",
    sm: "text-[16px] px-4 py-2",
    md: "text-[18px] px-5 py-2.5",
    lg: "text-[24px] px-6 py-3",
    xl: "text-[28px] px-7 py-4",
  };

  // Icon sizes
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 24,
    xl: 28,
  };

  // State classes with transitions
  const stateClasses = {
    default: "text-neutral-black bg-transparent",
    hover: "text-primary-shade1 bg-transparent",
    pressed: "text-info-shade5 bg-gradient-to-br from-blue-100/50 to-gray-200/50",
    disabled: "text-primary-tint4 bg-transparent cursor-not-allowed",
  };

  // Enhanced transition classes
  const transitionClasses = `
    transition-all 
    duration-300 
    ease-in-out
    transform
    hover:scale-[1.02]
    active:scale-[0.98]
  `;

  const getStateClass = () => {
    if (disabled) return stateClasses.disabled;
    return stateClasses[buttonState] || stateClasses.default;
  };

  const renderIcon = (iconName, position) => {
    if (!iconName) return null;
    
    const IconComponent = RemixIcons[iconName];
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found in Remix Icons`);
      return null;
    }

    return (
      <IconComponent
        size={iconSizes[size]}
        className={`transition-transform duration-300 ${
          position === "left" ? "mr-2" : "ml-2"
        } ${
          buttonState === "hover" ? "scale-110" : 
          buttonState === "pressed" ? "scale-95" : ""
        }`}
      />
    );
  };

  const handleClick = (e) => {
    if (disabled) return;
    
    // Set pressed state
    setButtonState("pressed");
    
    // Trigger onClick prop after a small delay
    setTimeout(() => {
      if (onClick) onClick(e);
      setButtonState("default");
    }, 150);
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-md font-medium
        ${transitionClasses}
        ${sizeClasses[size]}
        ${getStateClass()}
        ${fullWidth ? "w-full" : "w-auto"}
        ${disabled ? "opacity-70" : ""}
        ${className}
      `}
      disabled={disabled}
      onClick={handleClick}
      aria-disabled={disabled}
      onMouseEnter={() => !disabled && setButtonState("hover")}
      onMouseLeave={() => !disabled && setButtonState("default")}
    >
      {renderIcon(leftIcon, "left")}
      {label && <span className="transition-all duration-300">{label}</span>}
      {renderIcon(rightIcon, "right")}
    </button>
  );
};

export default TextButton;