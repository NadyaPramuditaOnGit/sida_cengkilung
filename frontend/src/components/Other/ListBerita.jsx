import React, { useState, useEffect } from 'react';
import Card from '../components/Other/Cards';
import Pagination from '../Button/Pagination';

const ListBerita = ({ beritaData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const sortedData = [...beritaData].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [beritaData]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {currentItems.map((berita, index) => (
          <Card
            key={berita.id || index}
            title={berita.title}
            content={berita.content}
            date={berita.date}
            thumbnail={berita.thumbnail}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Menampilkan {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, sortedData.length)} dari {sortedData.length} berita
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ListBerita;