import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiSearchLine, RiLoginBoxLine, RiCloseLine, RiMenuLine } from '@remixicon/react';
import axios from 'axios';

const GNavbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get('/api/search', {
        params: {
          query: searchQuery,
        }
      });
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchItemClick = (item) => {
    if (item.type === 'berita') {
      navigate(`/guest/info-desa-adat/berita/${item.id}`);
    } else if (item.type === 'profil') {
      navigate(`/guest/info-desa-adat/profil-desa-adat`);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: 'Beranda', path: '/guest/beranda' },
    { name: 'Sejarah', path: '/guest/sejarah' },
    { name: 'Galeri', path: '/guest/galeri' },
    {
      name: 'Info Desa',
      path: '/guest/info-desa-adat',
      submenu: [
        { name: 'Berita', path: '/guest/info-desa-adat/berita' },
        { name: 'Data Desa', path: '/guest/info-desa-adat/data-desa-adat' },
        { name: 'Profil Desa', path: '/guest/info-desa-adat/profil-desa-adat' },
      ],
    },
  ];

  const getLinkClass = (path) =>
    location.pathname.startsWith(path)
      ? 'text-primary-shade5 bg-gradient-to-r from-primary-tint1 to-primary-tint4 bg-opacity-30'
      : 'text-primary-shade5 hover:text-primary-shade1';

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-primary-tint3 font-roboto transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/guest/beranda" className="text-2xl font-extrabold font-lato text-primary-shade5">
                SIDA CENGKILUNG
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
              {/* Search Bar with Results */}
              <div className="relative mr-2">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Cari berita, profil, dll..."
                      className="w-full md:w-40 lg:w-56 px-3 py-2 rounded-l-sm border border-netural-smoke-grey focus:outline-none focus:ring-1 focus:ring-primary-shade1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery && setShowResults(true)}
                    />
                    <button
                      type="submit"
                      className="absolute right-0 h-full flex items-center justify-center pr-3 text-netural-concrete-grey hover:text-primary-shade1 md:hidden"
                    >
                      <RiSearchLine className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="hidden md:flex items-center justify-center px-3 py-2 bg-primary-shade1 text-white rounded-r-sm hover:bg-primary-tint2 transition-colors"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <RiSearchLine className="h-4 w-4" />
                    )}
                  </button>
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        onClick={() => handleSearchItemClick(result)}
                      >
                        <div className="font-bold text-primary-shade5">{result.title}</div>
                        <div className="text-xs text-netural-concrete-grey">
                          {new Date(result.date).toLocaleDateString()} | 
                          {result.type === 'berita' ? ' Berita' : ' Profil Desa'}
                        </div>
                        <div className="text-sm text-gray-700 mt-1 line-clamp-2">
                          {result.content.substring(0, 100)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex space-x-1 lg:space-x-2">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative group">
                    <Link
                      to={link.path}
                      className={`px-3 py-2 text-sm font-bold rounded-md ${getLinkClass(link.path)}`}
                    >
                      {link.name}
                    </Link>

                    {link.submenu && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        {link.submenu.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.path}
                            className={`block px-4 py-2 text-sm font-bold ${
                              location.pathname === subLink.path
                                ? 'bg-gradient-to-r from-primary-tint1 to-primary-tint4 text-primary-shade5'
                                : 'text-primary-shade5 hover:bg-primary-tint1'
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Auth Button */}
              <button
                onClick={toggleAuthModal}
                className="ml-2 flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-primary-shade1 font-bold text-white rounded-md hover:bg-primary-tint2 transition-colors"
              >
                <span className="hidden lg:inline">Masuk/Daftar</span>
                <span className="lg:hidden">Login</span>
                <RiLoginBoxLine className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-primary-shade5 hover:text-primary-shade1 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <RiCloseLine className="h-6 w-6" />
                ) : (
                  <RiMenuLine className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {/* Mobile Search */}
            <div className="mb-4 px-3">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Cari berita, profil, dll..."
                  className="flex-1 px-3 py-2 rounded-l-md border border-netural-smoke-grey focus:outline-none focus:ring-1 focus:ring-primary-shade1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-3 py-2 border-t border-b border-r border-netural-smoke-grey rounded-r-md hover:bg-gray-50"
                  disabled={isSearching}
                >
                  {isSearching ? '...' : <RiSearchLine className="h-4 w-4 text-netural-concrete-grey" />}
                </button>
              </form>
              
              {/* Mobile Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="mt-2 bg-white rounded-md shadow">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                      onClick={() => {
                        handleSearchItemClick(result);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="font-bold text-primary-shade5">{result.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Links */}
            {navLinks.map((link) => (
              <div key={link.name} className="space-y-1">
                <Link
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${getLinkClass(link.path)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>

                {/* Mobile Submenu */}
                {link.submenu && (
                  <div className="pl-4 space-y-1">
                    {link.submenu.map((subLink) => (
                      <Link
                        key={subLink.name}
                        to={subLink.path}
                        className={`block px-3 py-2 rounded-md text-sm font-bold ${
                          location.pathname === subLink.path
                            ? 'bg-gradient-to-r from-primary-tint1 to-primary-tint4 text-primary-shade5'
                            : 'text-primary-shade5 hover:bg-primary-tint1'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Auth Button */}
            <button
              onClick={() => {
                toggleAuthModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-primary-shade1 font-medium text-white rounded-md hover:bg-primary-tint2"
            >
              <span>Masuk/Daftar</span>
              <RiLoginBoxLine className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={toggleAuthModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Masuk atau Daftar
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500">
                        Masuk
                      </button>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500">
                        Daftar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={toggleAuthModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GNavbar;