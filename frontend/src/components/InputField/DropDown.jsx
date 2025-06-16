// src/components/Dropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowDownSLine } from "@remixicon/react";

const Dropdown = ({
  label = "Pilih opsi",
  options = [],
  disabled = false,
  onSelect = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    onSelect(option);
  };

  // Klik di luar dropdown untuk menutup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-xs relative font-roboto" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={toggleDropdown}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border text-sm transition-all
          ${disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : isOpen
            ? "bg-blue-50 border-blue-500 text-blue-600 shadow-md"
            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100"
          }
        `}
      >
        <span>{selected?.label || label}</span>
        <ArrowDownSLine
          className={`w-5 h-5 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Items */}
      {isOpen && !disabled && (
        <ul
          className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition-all"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;