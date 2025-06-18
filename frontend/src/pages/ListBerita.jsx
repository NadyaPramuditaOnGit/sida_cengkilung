import React from 'react';
import ListBerita from '../components/ListBerita';

const BeritaPage = ({ beritaData }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ListBerita beritaData={beritaData} />
    </div>
  );
};

export default BeritaPage;
