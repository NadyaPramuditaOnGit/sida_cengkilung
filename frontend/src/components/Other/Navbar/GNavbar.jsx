import { useState, useEffect } from 'react';
import { RiMenuLine, RiCloseLine, RiArrowDownSLine, RiSearchLine } from '@remixicon/react';
import { Link } from 'react-router-dom';
import Button from '../../Button/Button';
import TextButton from '../../Button/TextButton';
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
            <TextButton
              as={Link}
              to="/"
              size="md"
              className="px-3 py-2 hover:text-primary-shade2"
            >
              Beranda
            </TextButton>
            
            <TextButton
              as={Link}
              to="/sejarah"
              size="md"
              className="px-3 py-2 hover:text-primary-shade2"
            >
              Sejarah
            </TextButton>
            
            <div className="relative">
              <TextButton
                size="md"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="px-3 py-2 hover:text-primary-shade2 flex items-center"
                rightIcon="RiArrowDownSLine"
              >
                Informasi Desa
                <RiArrowDownSLine 
                  className={`ml-1 transition-transform ${isInfoOpen ? 'transform rotate-180' : ''}`}
                />
              </TextButton>

              {isInfoOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                  <TextButton
                    as={Link}
                    to="/berita"
                    size="md"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Berita Desa
                  </TextButton>
                  <TextButton
                    as={Link}
                    to="/data-desa"
                    size="md"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Data Desa
                  </TextButton>
                  <TextButton
                    as={Link}
                    to="/profil-desa"
                    size="md"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Profil Desa
                  </TextButton>
                </div>
              )}
            </div>
            
            <TextButton
              as={Link}
              to="/galeri"
              size="md"
              className="px-3 py-2 hover:text-primary-shade2"
            >
              Galeri
            </TextButton>
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
            
            <TextButton
              as={Link}
              to="/"
              size="md"
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </TextButton>
            
            <TextButton
              as={Link}
              to="/sejarah"
              size="md"
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sejarah
            </TextButton>
            
            <div>
              <TextButton
                size="md"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-gray-100"
                rightIcon="RiArrowDownSLine"
              >
                Informasi Desa
                <RiArrowDownSLine 
                  className={`ml-1 transition-transform ${isInfoOpen ? 'transform rotate-180' : ''}`}
                />
              </TextButton>
              
              {isInfoOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <TextButton
                    as={Link}
                    to="/berita"
                    size="md"
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Berita Desa
                  </TextButton>
                  <TextButton
                    as={Link}
                    to="/data-desa"
                    size="md"
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Data Desa
                  </TextButton>
                  <TextButton
                    as={Link}
                    to="/profil-desa"
                    size="md"
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profil Desa
                  </TextButton>
                </div>
              )}
            </div>
            
            <TextButton
              as={Link}
              to="/galeri"
              size="md"
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galeri
            </TextButton>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GNavbar;