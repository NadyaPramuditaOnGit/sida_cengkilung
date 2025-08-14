import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BDataDesa = () => {
  const jenisList = [
    { label: 'Jumlah Penduduk', key: 'Kependudukan' },
    { label: 'Agama', key: 'Agama' },
    { label: 'Pekerjaan', key: 'Pekerjaan' },
    { label: 'Pendidikan', key: 'Pendidikan' },
    { label: 'Usia', key: 'Usia' },
    { label: 'Status Perkawinan', key: 'Status' }
  ];

  const [dataSemua, setDataSemua] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = jenisList.map(j =>
        axios.get(`/api/data-desa?jenis=${j.key}`)
      );
      const responses = await Promise.all(promises);

      const dataMap = {};
      responses.forEach((res, index) => {
        const jenis = jenisList[index].key;
        const result = res.data;
        const data = Array.isArray(result.data) ? result.data : [];
        const total = result.total || {
          total_laki: 0,
          total_perempuan: 0,
          total: 0
        };
        dataMap[jenis] = { data, total };
      });

      setDataSemua(dataMap);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center font-roboto">Memuat data...</p>;
  if (error) return <p className="text-center text-red-500 font-roboto">{error}</p>;

  return (
    <div className="font-roboto p-4 max-w-3xl mx-auto rounded">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Data Desa</h3>
        <a href="/admin/data-desa/edit" className="text-blue-600 font-bold text-md hover:underline">Edit</a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-blue-800 font-bold text-white text-center">
              <th className="py-2 px-4 border border-gray-300">No.</th>
              <th className="py-2 px-4 border border-gray-300">Keterangan</th>
              <th className="py-2 px-4 border border-gray-300">Laki-laki</th>
              <th className="py-2 px-4 border border-gray-300">Perempuan</th>
              <th className="py-2 px-4 border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {jenisList.map((j, index) => (
              <tr key={j.key} className="text-center font-bold">
                <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                <td className="py-2 px-4 border border-gray-300">{j.label}</td>
                <td className="py-2 px-4 border border-gray-300">{dataSemua[j.key]?.total.total_laki}</td>
                <td className="py-2 px-4 border border-gray-300">{dataSemua[j.key]?.total.total_perempuan}</td>
                <td className="py-2 px-4 border border-gray-300">{dataSemua[j.key]?.total.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BDataDesa;