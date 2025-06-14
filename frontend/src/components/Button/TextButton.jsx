import React from "react";
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
  const sizeClasses = {
    xs: "text-[14px] px-3 py-1.5",
    sm: "text-[16px] px-4 py-2",
    md: "text-[18px] px-5 py-2.5",
    lg: "text-[24px] px-6 py-3",
    xl: "text-[28px] px-7 py-4",
  };

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 24,
    xl: 28,
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
        className={`font-semibold ${position === "left" ? "mr-2" : "ml-2"}`}
      />
    );
  };

  return (
    <button
      className={`
        font-semibold
        rounded-md 
        inline-flex 
        items-center 
        justify-center 
        ${fullWidth ? "w-full" : "w-auto"} 
        ${disabled ? "cursor-not-allowed" : ""}
        ${sizeClasses[size]}
        ${className}
        text-neutral-black bg-transparent
        hover:text-primary-shade1
        active:text-info-shade5
        focus:text-primary-shade4
        disabled:text-primary-tint4
        active:bg-[linear-gradient(90deg,_rgba(0,136,238,0.2)_0%,_rgba(154,189,223,0.2)_100%)]
        hover:transition-colors hover:duration-200
      `}
      disabled={disabled}
      onClick={onClick}
      aria-disabled={disabled}>
      {renderIcon(leftIcon, "left")}
      {label && <span className="font-semibold">{label}</span>}
      {renderIcon(rightIcon, "right")}
    </button>
  );
};

export default TextButton;