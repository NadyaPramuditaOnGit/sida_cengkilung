import { useState } from 'react';
import Pagination from './components/Button/Pagination';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      console.log("Berpindah ke halaman:", page);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl mb-4 font-bold font-roboto">Tes Komponen Pagination</h1>
      
      <div className="mb-4">
        <p className="text-lg font-roboto">Halaman saat ini: <strong>{currentPage}</strong></p>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default App;