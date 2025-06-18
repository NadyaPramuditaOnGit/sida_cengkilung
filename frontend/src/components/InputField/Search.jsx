import { useState, useEffect, useRef } from 'react';
import { RiSearchLine, RiTimeLine, RiCloseLine, RiCloseCircleLine } from 'react-icons/ri';

const SearchInputWithHistory = ({ onSearch, placeholder = 'Search...' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef(null);
  const historyDropdownRef = useRef(null);

  // Load/save history
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory(prev => [searchQuery, ...prev].slice(0, 10));
      }
      onSearch(searchQuery);
      setShowHistory(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto font-sans"> {/* Gunakan font-sans */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 rounded-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 font-normal"
          />
          <button
            type="submit"
            className="absolute right-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <RiSearchLine className="h-6 w-6" />
          </button>
        </div>
      </form>

      {showHistory && searchHistory.length > 0 && (
        <div
          ref={historyDropdownRef}
          className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden font-sans"
        >
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Recent searches</h3>
            <button
              onClick={() => setSearchHistory([])}
              className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none flex items-center gap-1"
            >
              <RiCloseLine /> Clear all
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {searchHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearchQuery(item);
                  onSearch(item);
                  setShowHistory(false);
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors"
              >
                <div className="flex items-center">
                  <RiTimeLine className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 font-normal">{item}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchHistory(prev => prev.filter(i => i !== item));
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RiCloseCircleLine className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInputWithHistory;