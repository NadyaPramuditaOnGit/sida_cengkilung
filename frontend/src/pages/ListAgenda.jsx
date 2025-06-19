import React, { useEffect, useState } from 'react';
import VerticalAgendaList from '../components/VerticalAgendaList';
import axios from 'axios';

const AgendaList = () => {
  const [agenda, setAgenda] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/agenda')
      .then(res => {
        const currentMonth = new Date().getMonth();
        const filtered = res.data.filter(item => new Date(item.date).getMonth() === currentMonth)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setAgenda(filtered);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Agenda Bulan Ini</h1>
      <VerticalAgendaList data={agenda} />
    </div>
  );
};

export default AgendaList;
