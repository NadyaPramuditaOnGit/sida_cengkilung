import { useState, useEffect, useRef } from 'react';
import { RiSearchLine, RiTimeLine, RiCloseLine, RiCloseCircleLine } from 'react-icons/ri';

const SearchInputWithHistory = ({ onSearch, placeholder = 'Search...' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        historyDropdownRef.current && 
        !historyDropdownRef.current.contains(event.target) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fungsi untuk melakukan pencarian ke API
  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Simpan hasil pencarian
      setSearchResults(data);
      
      // Panggil callback dengan hasil pencarian jika diperlukan
      if (onSearch) {
        onSearch(query, data);
      }
      
      // Tambahkan ke history jika belum ada
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev].slice(0, 10));
      }
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
      setShowHistory(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="relative max-w-xl mx-auto font-roboto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowHistory(e.target.value === '' && searchHistory.length > 0);
            }}
            onFocus={() => setShowHistory(searchHistory.length > 0)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 rounded-4 border border-netural-sand-grey focus:outline-none focus:ring-2 focus:ring-primary-shade1 focus:border-transparent shadow-sm transition-all duration-200 font-normal"
          />
          <button
            type="submit"
            className="absolute right-2 p-2 text-netural-concrete-grey hover:text-netural-rock-grey focus:outline-none"
            disabled={isSearching}
          >
            {isSearching ? (
              <svg className="animate-spin h-6 w-6 text-netural-concrete-grey" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <RiSearchLine className="h-6 w-6" />
            )}
          </button>
        </div>
      </form>

      {/* Dropdown history */}
      {showHistory && searchHistory.length > 0 && (
        <div
          ref={historyDropdownRef}
          className="absolute z-10 mt-2 w-full bg-netural-white rounded-lg shadow-lg border border-netural-snow-grey overflow-hidden font-sans"
        >
          <div className="flex justify-between items-center px-4 py-2 border-b border-netural-snow-grey bg-gray-50">
            <h3 className="text-sm font-medium text-netural-rock-grey">Recent searches</h3>
            <button
              onClick={() => setSearchHistory([])}
              className="text-xs text-primary-shade3 hover:text-primary-shade4 focus:outline-none flex items-center gap-1"
            >
              <RiCloseLine /> Clear all
            </button>
          </div>
          <ul className="divide-y divide-netural-sand-grey">
            {searchHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearchQuery(item);
                  performSearch(item);
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors"
              >
                <div className="flex items-center">
                  <RiTimeLine className="h-5 w-5 text-netural-silver-grey mr-3" />
                  <span className="text-netural-rock-grey font-normal">{item}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchHistory(prev => prev.filter(i => i !== item));
                  }}
                  className="text-netural-steel-grey hover:text-netural-rock-grey focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RiCloseCircleLine className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tampilkan hasil pencarian */}
      {searchResults.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-700">
              Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <li key={`${result.type}-${result.id}`} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-3">
                    {result.type === 'video' && <RiVideoLine className="h-5 w-5 text-blue-600" />}
                    {result.type === 'news' && <RiNewspaperLine className="h-5 w-5 text-blue-600" />}
                    {result.type === 'photo' && <RiImageLine className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{result.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {result.type} • {result.category || 'Uncategorized'}
                    </p>
                    <p className="text-gray-600 mt-2 text-sm">
                      {result.description?.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInputWithHistory;