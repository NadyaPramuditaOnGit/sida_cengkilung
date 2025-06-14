import React from "react";
import * as RemixIcons from "@remixicon/react";

const Button = ({
  size = "medium",
  variant = "primary",
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
      default: "bg-primary-shade1 text-white rounded-[4px]",
      hover: "hover:bg-primary-tint2 hover:text-white rounded-[4px]",
      pressed: "active:bg-primary-shade4 focus:bg-primary-shade4 active:text-white focus:text-white rounded-[4px]",
      disabled: "bg-primary-tint4 text-white cursor-not-allowed rounded-[4px]",
    },
    secondary: {
      default: "bg-white text-primary-shade1 border border-primary-shade1 rounded-[4px]",
      hover: "hover:bg-white hover:text-primary-tint2 hover:border-primary-tint2 rounded-[4px]",
      pressed: "active:bg-white active:text-primary-shade4 focus:bg-white focus:text-primary-shade4 active:border-primary-shade4 focus:border-primary-shade4 rounded-[4px]",
      disabled: "bg-white text-primary-tint4 border-primary-tint4 cursor-not-allowed rounded-[4px]",
    },
    tertiary: {
      default: "bg-white text-primary-shade1 rounded-[4px]",
      hover: "hover:bg-white hover:text-primary-tint2 rounded-[4px]",
      pressed: "active:bg-white active:text-primary-shade4 focus:bg-white focus:text-primary-shade4 rounded-[4px]",
      disabled: "bg-white text-primary-tint4 cursor-not-allowed rounded-[4px]",
    },
    "round-primary": {
      default: "bg-primary-shade1 text-white rounded-full",
      hover: "hover:bg-primary-tint2 hover:text-white rounded-full",
      pressed: "active:bg-primary-shade4 focus:bg-primary-shade4 active:text-white focus:text-white rounded-full",
      disabled: "bg-primary-tint4 text-white cursor-not-allowed rounded-full",
    },
    "round-secondary": {
      default: "bg-white text-primary-shade1 border border-primary-shade1 rounded-full",
      hover: "hover:bg-white hover:text-primary-tint2 hover:border-primary-tint2 rounded-full",
      pressed: "active:bg-white active:text-primary-shade4 focus:bg-white focus:text-primary-shade4 active:border-primary-shade4 focus:border-primary-shade4 rounded-full",
      disabled: "bg-white text-primary-tint4 border-primary-tint4 cursor-not-allowed rounded-full",
    },
    "round-tertiary": {
      default: "bg-white text-primary-shade1 rounded-full",
      hover: "hover:bg-white hover:text-primary-tint2 rounded-full",
      pressed: "active:bg-white active:text-primary-shade4 focus:bg-white focus:text-primary-shade4 rounded-full",
      disabled: "bg-white text-primary-tint4 cursor-not-allowed rounded-full",
    },
  };

  // Get state classes
  const getStateClasses = () => {
    if (disabled) return variantClasses[variant].disabled;
    
    return `
      ${variantClasses[variant].default}
      ${variantClasses[variant].hover}
      ${variantClasses[variant].pressed}
    `;
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
        font-roboto font-medium
        ${sizeClasses[size]}
        ${widthClasses[size]}
        ${getStateClasses()}
        gap-[10px] md:gap-[6px]
        transition-colors duration-200
        ${className}
        ${fullWidth ? "w-full" : ""}
        focus:outline-none
      `}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {renderIcon(leftIcon, "left")}
      {label && <span className="font-medium">{label}</span>}
      {renderIcon(rightIcon, "right")}
    </button>
  );
};

export default Button;