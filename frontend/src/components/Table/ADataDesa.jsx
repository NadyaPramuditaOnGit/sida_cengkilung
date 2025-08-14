import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';

const DataDesaComponent = () => {
  const [activeTab, setActiveTab] = useState('Kependudukan');
  const [tableData, setTableData] = useState([]);
  const [totalData, setTotalData] = useState({ 
    total_laki: 0, 
    total_perempuan: 0, 
    total: 0 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [sortConfig, setSortConfig] = useState({ 
    key: 'label', 
    direction: 'asc' 
  });

  const availableTabs = ['Kependudukan', 'Agama', 'Pekerjaan', 'Pendidikan', 'Usia', 'Status'];
  const availableYears = ['Semua', '2025', '2024'];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  
  const sseRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const dataCache = useRef({});

  // Sorting
  const sortedData = useMemo(() => {
    const data = [...tableData];
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [tableData, sortConfig]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dataRes, totalRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/data-desa`, {
          params: {
            jenis: activeTab,
            tahun: selectedYear !== 'Semua' ? selectedYear : undefined
          },
          timeout: 10000
        }),
        axios.get(`${API_BASE_URL}/api/data-desa/total`, {
          params: {
            jenis: activeTab,
            tahun: selectedYear !== 'Semua' ? selectedYear : undefined
          },
          timeout: 10000
        })
      ]);

      const processedData = dataRes.data.data.map(item => ({
        ...item,
        label: item.label || item.keterangan || 'Tidak ada label',
        total: (item.jumlah_laki || 0) + (item.jumlah_perempuan || 0)
      }));

      setTableData(processedData);
      setTotalData(totalRes.data.total);
      dataCache.current[activeTab] = { data: processedData, total: totalRes.data.total, lastUpdated: Date.now() };
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat data');
      if (dataCache.current[activeTab]) {
        setTableData(dataCache.current[activeTab].data);
        setTotalData(dataCache.current[activeTab].total);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedYear, API_BASE_URL]);

  // Init SSE
  const initSSE = useCallback(() => {
    if (sseRef.current) {
      sseRef.current.close();
    }
    const sseUrl = `${API_BASE_URL}/sse/data-desa`;
    console.log('Connecting to SSE:', sseUrl);

    sseRef.current = new EventSource(sseUrl);

    sseRef.current.onopen = () => {
      console.log('SSE connected');
      reconnectAttempts.current = 0;
      setError(null);
      fetchData();
    };

    sseRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'DATA_DESA_UPDATE') {
          const { jenis, data, total } = message.payload;
          dataCache.current[jenis] = { data, total, lastUpdated: Date.now() };
          if (jenis === activeTab) {
            setTableData(data);
            setTotalData(total);
          }
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    sseRef.current.onerror = (error) => {
      console.error('SSE error:', error);
      sseRef.current.close();
      const maxReconnectAttempts = 5;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        console.log(`Reconnecting SSE in ${delay}ms...`);
        setTimeout(initSSE, delay);
      } else {
        setError('Gagal menyambungkan ke server real-time. Silakan refresh halaman.');
      }
    };
  }, [API_BASE_URL, activeTab, fetchData]);

  // Tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSortConfig({ key: 'label', direction: 'asc' });
    if (dataCache.current[tab]) {
      setTableData(dataCache.current[tab].data);
      setTotalData(dataCache.current[tab].total);
    } else {
      fetchData();
    }
  }, [fetchData]);

  // Sorting click
  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Column label
  const getColumnLabel = useCallback(() => {
    switch(activeTab) {
      case 'Kependudukan': return 'Jenis Penduduk';
      case 'Agama': return 'Agama';
      case 'Pekerjaan': return 'Jenis Pekerjaan';
      case 'Pendidikan': return 'Tingkat Pendidikan';
      case 'Usia': return 'Kelompok Usia';
      case 'Status': return 'Status Perkawinan';
      default: return 'Kategori';
    }
  }, [activeTab]);

  // Effect init SSE
  useEffect(() => {
    initSSE();
    return () => {
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, [initSSE]);

  // Effect fetch data when tab/year changes
  useEffect(() => {
    fetchData();
  }, [activeTab, selectedYear, fetchData]);

  // ==================== UI Rendering Sama Persis ====================
  return (
    <div className="flex flex-col md:flex-row font-roboto bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white text-gray-800 border-b md:border-b-0 md:border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-shade1">SIDA CENGKILUNG</h1>
        </div>
        <nav className="p-4 flex overflow-x-auto md:block md:overflow-visible">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              className={`flex-shrink-0 md:w-full text-left p-3 mb-1 text-sm rounded-md mx-1 md:mx-0 ${
                activeTab === tab
                  ? 'font-bold text-blue-600 bg-blue-50'
                  : 'text-netural-charcol-grey font-bold hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isLoading && !tableData.length ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Memuat data...</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={fetchData}
                  className="ml-2 text-red-700 font-semibold hover:text-red-900"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-netural-charcol-grey">Data {activeTab}</h2>
              <div className="flex space-x-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border rounded px-3 py-1 text-sm font-roboto font-semibold"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year === 'Semua' ? 'Semua Tahun' : year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-primary-shade3">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No.</th>
                      <th onClick={() => requestSort('label')} className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                        {getColumnLabel()}
                        {sortConfig.key === 'label' && <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th onClick={() => requestSort('jumlah_laki')} className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                        Laki-Laki
                        {sortConfig.key === 'jumlah_laki' && <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th onClick={() => requestSort('jumlah_perempuan')} className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                        Perempuan
                        {sortConfig.key === 'jumlah_perempuan' && <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tahun</th>
                      <th onClick={() => requestSort('total')} className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                        Total
                        {sortConfig.key === 'total' && <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedData.map((row, index) => (
                      <tr key={row.id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.label}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{row.jumlah_laki?.toLocaleString('id-ID') || '0'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{row.jumlah_perempuan?.toLocaleString('id-ID') || '0'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{row.tahun || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{row.total?.toLocaleString('id-ID') || '0'}</td>
                      </tr>
                    ))}
                    <tr className="bg-netural-white font-semibold">
                      <td></td>
                      <td className="text-primary-shade1">TOTAL</td>
                      <td>{totalData.total_laki?.toLocaleString('id-ID') || '0'}</td>
                      <td>{totalData.total_perempuan?.toLocaleString('id-ID') || '0'}</td>
                      <td></td>
                      <td className="text-primary-shade1 font-bold">{totalData.total?.toLocaleString('id-ID') || '0'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total {activeTab}</h3>
                <p className="mt-1 text-3xl font-bold text-blue-600">{totalData.total?.toLocaleString('id-ID') || '0'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Laki-Laki</h3>
                <p className="mt-1 text-3xl font-bold text-blue-600">{totalData.total_laki?.toLocaleString('id-ID') || '0'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Perempuan</h3>
                <p className="mt-1 text-3xl font-bold text-blue-600">{totalData.total_perempuan?.toLocaleString('id-ID') || '0'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataDesaComponent;