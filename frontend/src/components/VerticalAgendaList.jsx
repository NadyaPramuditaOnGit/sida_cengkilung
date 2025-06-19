import React from 'react';
import AgendaCard from '../pages/ListAgenda';

const VerticalAgendaList = ({ data }) => {
  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      {data.length > 0 ? (
        data.map(item => <AgendaCard key={item.id} {...item} />)
      ) : (
        <p className="text-center text-gray-500">Tidak ada agenda bulan ini.</p>
      )}
    </div>
  );
};

export default VerticalAgendaList;