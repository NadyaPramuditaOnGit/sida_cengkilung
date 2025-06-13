import React from "react";
import * as RemixIcons from "@remixicon/react";

const Button = ({
  size = "medium",
  variant = "primary",
  state = "default",
  leftIcon,
  rightIcon,
  label,
  disabled = false,
  onClick,
  className = "",
  fullWidth = false,
}) => {
  // Size classes
  const sizeClasses = {
    small: "h-[36px] md:h-[44px] px-[8px] md:px-[10px] text-[12px] md:text-[14px]",
    medium: "h-[40px] md:h-[48px] px-[8px] md:px-[10px] text-[14px] md:text-[18px]",
    large: "h-[44px] md:h-[52px] px-[8px] md:px-[10px] text-[16px] md:text-[24px]",
  };

  // Width classes
  const widthClasses = {
    small: fullWidth ? "w-full" : "w-[100px] md:w-[118px]",
    medium: fullWidth ? "w-full" : "w-[120px] md:w-[136px]",
    large: fullWidth ? "w-full" : "w-[140px] md:w-[159px]",
  };

  // Variant classes
  const variantClasses = {
    primary: {
      default: "bg-primary-shade1 text-white",
      hover: "hover:bg-blue-600",
      pressed: "active:bg-blue-700",
      disabled: "bg-blue-300 text-white cursor-not-allowed",
    },
    secondary: {
      default: "bg-white text-blue-500 border border-blue-500",
      hover: "hover:bg-blue-50",
      pressed: "active:bg-blue-100",
      disabled: "bg-white text-blue-300 border-blue-300 cursor-not-allowed",
    },
    tertiary: {
      default: "bg-white text-blue-500",
      hover: "hover:bg-blue-50",
      pressed: "active:bg-blue-100",
      disabled: "text-blue-300 cursor-not-allowed",
    },
    "round-primary": {
      default: "bg-blue-500 text-white rounded-full",
      hover: "hover:bg-blue-600",
      pressed: "active:bg-blue-700",
      disabled: "bg-blue-300 text-white cursor-not-allowed rounded-full",
    },
    "round-secondary": {
      default: "bg-white text-blue-500 border border-blue-500 rounded-full",
      hover: "hover:bg-blue-50",
      pressed: "active:bg-blue-100",
      disabled: "bg-white text-blue-300 border-blue-300 cursor-not-allowed rounded-full",
    },
    "round-tertiary": {
      default: "bg-transparent text-blue-500 rounded-full",
      hover: "hover:bg-blue-50",
      pressed: "active:bg-blue-100",
      disabled: "text-blue-300 cursor-not-allowed rounded-full",
    },
  };

  // Get state classes
  const getStateClasses = () => {
    if (disabled) return variantClasses[variant].disabled;
    if (state === "hover") return `${variantClasses[variant].default} ${variantClasses[variant].hover}`;
    if (state === "pressed") return `${variantClasses[variant].default} ${variantClasses[variant].pressed}`;
    return variantClasses[variant].default;
  };

  // Render icon
  const renderIcon = (iconName, position) => {
    if (!iconName) return null;
    
    const IconComponent = RemixIcons[iconName];
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found in Remix Icons`);
      return null;
    }

    const iconSize = size === "small" 
      ? "text-[12px] md:text-[14px]" 
      : size === "medium" 
        ? "text-[14px] md:text-[18px]" 
        : "text-[16px] md:text-[24px]";
    
    return (
      <div className={iconSize}>
        <IconComponent
          className={position === "left" ? "mr-[6px] md:mr-[8px]" : "ml-[6px] md:ml-[8px]"}
        />
      </div>
    );
  };

  // Custom shadow style
  const customShadow = {
    boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.25)"
  };

  return (
    <button
      style={customShadow}
      className={`
        flex items-center justify-center
        font-roboto font-medium /* Changed to Roboto medium/semi-bold */
        ${sizeClasses[size]}
        ${widthClasses[size]}
        ${getStateClasses()}
        gap-[6px] md:gap-[8px]
        transition-colors duration-200
        ${className}
        ${fullWidth ? "w-full" : ""}
      `}
      disabled={disabled}
      onClick={onClick}
      data-state={state}
    >
      {renderIcon(leftIcon, "left")}
      {label && <span className="font-medium">{label}</span>}
      {renderIcon(rightIcon, "right")}
    </button>
  );
};

export default Button;