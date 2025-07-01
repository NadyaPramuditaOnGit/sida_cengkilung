import { useState, useEffect } from 'react';
import { RiMenuLine, RiCloseLine, RiArrowDownSLine, RiSearchLine, RiHomeLine, RiHistoryLine, RiNewspaperLine, RiDatabaseLine, RiProfileLine, RiImageLine } from '@remixicon/react';
import { Link } from 'react-router-dom';
import Button from '../../Button/Button';
import UnderlineButton from '../../Button/UnderlineButton';
import Search from '../../InputField/Search';
import logoDesa from '/assets/logo.png';

const GNavbar = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tutup dropdown jika mobile menu dibuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsInfoOpen(false);
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-primary-tint3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo dan Menu Button (Mobile) */}
          <div className="flex items-center">
            <Button
              variant="tertiary"
              size="medium"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden mr-2 p-2"
              iconVariant={isMobileMenuOpen ? "delete" : "view"}
            >
              {isMobileMenuOpen ? (
                <RiCloseLine className="w-5 h-5" />
              ) : (
                <RiMenuLine className="w-5 h-5" />
              )}
            </Button>
            
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={logoDesa}
                alt="Logo Desa Adat Cengkilung"
                className="w-12 h-12"
              />
              <span className="ml-3 text-xl font-bold text-netural-charcol-grey hidden sm:block">
                SIDA CENGKILUNG
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 mx-4 max-w-md">
            <Search placeholder="Cari..." />
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            <UnderlineButton
              as={Link}
              to="/"
              size="md"
              label="Beranda"
              Icon={RiHomeLine}
              className="px-3 py-2"
            />
            
            <UnderlineButton
              as={Link}
              to="/sejarah"
              size="md"
              label="Sejarah"
              Icon={RiHistoryLine}
              className="px-3 py-2"
            />
            
            <div className="relative">
              <UnderlineButton
                size="md"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                label="Informasi Desa"
                Icon={RiNewspaperLine}
                className="px-3 py-2 flex items-center"
              >
                <RiArrowDownSLine 
                  className={`ml-1 transition-transform ${isInfoOpen ? 'transform rotate-180' : ''}`}
                />
              </UnderlineButton>

              {isInfoOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                  <UnderlineButton
                    as={Link}
                    to="/berita"
                    size="md"
                    label="Berita Desa"
                    Icon={RiNewspaperLine}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  />
                  <UnderlineButton
                    as={Link}
                    to="/data-desa"
                    size="md"
                    label="Data Desa"
                    Icon={RiDatabaseLine}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  />
                  <UnderlineButton
                    as={Link}
                    to="/profil-desa"
                    size="md"
                    label="Profil Desa"
                    Icon={RiProfileLine}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  />
                </div>
              )}
            </div>
            
            <UnderlineButton
              as={Link}
              to="/galeri"
              size="md"
              label="Galeri"
              Icon={RiImageLine}
              className="px-3 py-2"
            />
          </div>

          {/* Search Button (Mobile) */}
          <div className="md:hidden">
            <Button
              variant="tertiary"
              size="medium"
              className="p-2"
              iconVariant="view"
            >
              <RiSearchLine className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Search Bar (Mobile) */}
            <div className="px-2 mb-2">
              <Search placeholder="Cari..." />
            </div>
            
            <UnderlineButton
              as={Link}
              to="/"
              size="md"
              label="Beranda"
              Icon={RiHomeLine}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <UnderlineButton
              as={Link}
              to="/sejarah"
              size="md"
              label="Sejarah"
              Icon={RiHistoryLine}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <div>
              <UnderlineButton
                size="md"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                label="Informasi Desa"
                Icon={RiNewspaperLine}
                className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <RiArrowDownSLine 
                  className={`ml-1 transition-transform ${isInfoOpen ? 'transform rotate-180' : ''}`}
                />
              </UnderlineButton>
              
              {isInfoOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <UnderlineButton
                    as={Link}
                    to="/berita"
                    size="md"
                    label="Berita Desa"
                    Icon={RiNewspaperLine}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <UnderlineButton
                    as={Link}
                    to="/data-desa"
                    size="md"
                    label="Data Desa"
                    Icon={RiDatabaseLine}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <UnderlineButton
                    as={Link}
                    to="/profil-desa"
                    size="md"
                    label="Profil Desa"
                    Icon={RiProfileLine}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              )}
            </div>
            
            <UnderlineButton
              as={Link}
              to="/galeri"
              size="md"
              label="Galeri"
              Icon={RiImageLine}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default GNavbar;