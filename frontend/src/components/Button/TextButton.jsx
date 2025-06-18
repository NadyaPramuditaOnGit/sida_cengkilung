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
  textAlign = "center",
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

  const alignmentClasses = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
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
        ${fullWidth ? "w-full" : "w-fit"} 
        inline-flex items-center
        ${alignmentClasses[textAlign]}
        ${disabled ? "cursor-not-allowed" : ""}
        ${sizeClasses[size]}
        ${className}
        text-neutral-black bg-transparent
        hover:text-primary-shade1
        active:text-info-shade5
        focus:text-primary2-shade2
        disabled:text-primary-tint4
        hover:transition-colors hover:duration-200
        touch-manipulation
        select-none
      `}
      disabled={disabled}
      onClick={onClick}
      onTouchStart={() => {}}
      aria-disabled={disabled}>
      {renderIcon(leftIcon, "left")}
      {label && <span className="font-semibold">{label}</span>}
      {renderIcon(rightIcon, "right")}
    </button>
  );
};

export default TextButton;