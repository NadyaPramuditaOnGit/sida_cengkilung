import React, { useState, useEffect } from "react";
import {
  RiAddFill,
  RiCheckLine,
  RiLoader2Line,
} from "@remixicon/react";

const buttonStyles = {
  base: "inline-flex items-center gap-2 px-4 py-2.5 border-b-[6px] font-bold font-['Roboto'] transition-all duration-300 ease-in-out rounded-sm",
  states: {
    default: "text-Netural-Black border-Netural-Black bg-transparent",
    hover: "text-Primary-Shade-Primary-Shade-1 border-Primary-Shade-Primary-Shade-1 bg-transparent",
    pressed:
      "text-Primary-Shade-Primary-Shade-4 border-Primary-Shade-Primary-Shade-4 bg-gradient-to-b from-sky-500/20 to-blue-300/20",
    disabled:
      "text-Primary-Tint-Primary-Tint-4 border-Primary-Tint-Primary-Tint-4 cursor-not-allowed opacity-50",
  },
  textSizes: {
    xs: "text-sm leading-none h-10",
    sm: "text-base leading-tight h-12",
    md: "text-lg leading-snug h-14",
    lg: "text-2xl leading-7 h-16",
    xl: "text-3xl leading-loose h-16",
  },
  iconSizes: {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  },
};

const UnderlineButton = ({
  size = "md",
  label = "Button",
  Icon = RiAddFill,
  loading = false,
}) => {
  const [state, setState] = useState("default");

  useEffect(() => {
    let timeout;
    if (state === "pressed") {
      timeout = setTimeout(() => setState("default"), 400);
    }
    return () => clearTimeout(timeout);
  }, [state]);

  const isDisabled = loading;
  const currentStyle = isDisabled ? "disabled" : state;

  const handleMouseEnter = () => {
    if (!isDisabled) setState("hover");
  };

  const handleMouseDown = () => {
    if (!isDisabled) setState("pressed");
  };

  const handleMouseLeave = () => {
    if (!isDisabled && state !== "pressed") setState("default");
  };

  const IconComponent = loading ? RiLoader2Line : Icon;

  return (
    <button
      className={`${buttonStyles.base} ${buttonStyles.states[currentStyle]} ${buttonStyles.textSizes[size]}`}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      disabled={isDisabled}
    >
      <IconComponent
        className={`${buttonStyles.iconSizes[size]} ${loading ? "animate-spin" : ""}`}
      />
      {label}
    </button>
  );
};

export default UnderlineButton;