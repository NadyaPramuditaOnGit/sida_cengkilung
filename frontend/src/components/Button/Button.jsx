import React from "react";
import * as RemixIcons from "@remixicon/react";
import {
  RiEdit2Fill,
  RiDeleteBin6Fill,
  RiEyeFill,
  RiAddFill,
} from '@remixicon/react';

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
  iconVariant,
  children,
}) => {
  const sizeClasses = {
    small: "h-[36px] md:h-[44px] px-[12px] text-[12px] md:text-[14px]",
    medium: "h-[40px] md:h-[48px] px-[16px] text-[14px] md:text-[18px]",
    large: "h-[44px] md:h-[52px] px-[20px] text-[16px] md:text-[24px]",
  };

  const variantClasses = {
    primary: {
      default: "bg-primary-shade1 text-white rounded-[4px]",
      hover: "hover:bg-primary-tint2 hover:text-white",
      pressed: "active:bg-primary-shade4 focus:bg-primary-shade4 active:text-white focus:text-white",
      disabled: "bg-primary-tint4 text-white cursor-not-allowed",
    },
    secondary: {
      default: "bg-white text-primary-shade1 border border-primary-shade1 rounded-[4px]",
      hover: "hover:text-primary-tint2 hover:border-primary-tint2",
      pressed: "active:text-primary-shade4 focus:text-primary-shade4 active:border-primary-shade4 focus:border-primary-shade4",
      disabled: "text-primary-tint4 border-primary-tint4 cursor-not-allowed",
    },
    tertiary: {
      default: "bg-white text-primary-shade1 rounded-[4px]",
      hover: "hover:text-primary-tint2",
      pressed: "active:text-primary-shade4 focus:text-primary-shade4",
      disabled: "text-primary-tint4 cursor-not-allowed",
    },
    "round-primary": {
      default: "bg-primary-shade1 text-white rounded-full",
      hover: "hover:bg-primary-tint2 hover:text-white",
      pressed: "active:bg-primary-shade4 focus:bg-primary-shade4 active:text-white focus:text-white",
      disabled: "bg-primary-tint4 text-white cursor-not-allowed",
    },
    "round-secondary": {
      default: "bg-white text-primary-shade1 border border-primary-shade1 rounded-full",
      hover: "hover:text-primary-tint2 hover:border-primary-tint2",
      pressed: "active:text-primary-shade4 focus:text-primary-shade4 active:border-primary-shade4 focus:border-primary-shade4",
      disabled: "text-primary-tint4 border-primary-tint4 cursor-not-allowed",
    },
    "round-tertiary": {
      default: "bg-white text-primary-shade1 rounded-full",
      hover: "hover:text-primary-tint2",
      pressed: "active:text-primary-shade4 focus:text-primary-shade4",
      disabled: "text-primary-tint4 cursor-not-allowed",
    },
    //icon variants
    edit: {
      default: "bg-yellow-500 text-white rounded-[4px]",
      hover: "hover:bg-yellow-600 hover:text-white",
      pressed: "active:bg-yellow-700 focus:bg-yellow-700 active:text-white focus:text-white",
      disabled: "bg-yellow-300 text-white cursor-not-allowed",
    },
    delete: {
      default: "bg-red-500 text-white rounded-[4px]",
      hover: "hover:bg-red-600 hover:text-white",
      pressed: "active:bg-red-700 focus:bg-red-700 active:text-white focus:text-white",
      disabled: "bg-red-300 text-white cursor-not-allowed",
    },
    view: {
      default: "bg-blue-500 text-white rounded-[4px]",
      hover: "hover:bg-blue-600 hover:text-white",
      pressed: "active:bg-blue-700 focus:bg-blue-700 active:text-white focus:text-white",
      disabled: "bg-blue-300 text-white cursor-not-allowed",
    },
    add: {
      default: "bg-green-500 text-white rounded-[4px]",
      hover: "hover:bg-green-600 hover:text-white",
      pressed: "active:bg-green-700 focus:bg-green-700 active:text-white focus:text-white",
      disabled: "bg-green-300 text-white cursor-not-allowed",
    },
  };

  const variantIcons = {
    edit: <RiEdit2Fill className="w-4 h-4" />,
    delete: <RiDeleteBin6Fill className="w-4 h-4" />,
    view: <RiEyeFill className="w-4 h-4" />,
    add: <RiAddFill className="w-4 h-4" />,
  };

  const getStateClasses = () => {
    if (disabled) return variantClasses[variant]?.disabled || "bg-gray-300 text-gray-500 cursor-not-allowed";
    return `
      ${variantClasses[variant]?.default || "bg-gray-300 text-black"}
      ${variantClasses[variant]?.hover || ""}
      ${variantClasses[variant]?.pressed || ""}
    `;
  };

  const renderIcon = (iconName, position) => {
    if (!iconName) return null;
    
    // If using iconVariant, return the predefined icon
    if (iconVariant && variantIcons[iconVariant] && position === "left") {
      return variantIcons[iconVariant];
    }
    
    const IconComponent = RemixIcons[iconName];
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found in Remix Icons`);
      return null;
    }
    const iconSize =
      size === "small" ? "text-[14px]" : size === "medium" ? "text-[18px]" : "text-[24px]";

    return (
      <IconComponent
        className={`${iconSize} ${position === "left" ? "mr-[6px]" : "ml-[6px]"}`}
      />
    );
  };

  const customShadow = {
    boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.25)",
  };

  return (
    <button
      style={customShadow}
      className={`
        inline-flex items-center justify-center
        font-roboto font-medium
        ${sizeClasses[size]}
        ${getStateClasses()}
        ${fullWidth ? "w-full" : "w-auto"}
        gap-[6px] md:gap-[8px]
        transition-colors duration-200
        focus:outline-none
        ${className}
      `}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {renderIcon(leftIcon, "left")}
      {(label || children) && <span className="font-medium">{label || children}</span>}
      {renderIcon(rightIcon, "right")}
    </button>
  );
};

export default Button;