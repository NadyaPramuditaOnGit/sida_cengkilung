import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  RiNewspaperLine,
  RiImageAddLine,
  RiCalendarEventLine,
  RiAddFill
} from '@remixicon/react';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

const AddShortcutModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('berita');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        // const response = await fetch(`/api/${activeTab}?limit=5&sort=uploadDate:desc`);
        // const result = await response.json();
        // setData(result.data);
        
        // For now, set empty array
        setData([]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleAddData = () => {
    switch (activeTab) {
      case 'berita':
        navigate('/kelola-berita');
        break;
      case 'galeri':
        navigate('/kelola-galeri');
        break;
      case 'agenda':
        navigate('/kelola-agenda');
        break;
      default:
        break;
    }
    onClose();
  };

  const shortcuts = [
    {
      icon: 'RiNewspaperLine',
      label: 'Tembahian Baluu-Pengumuman',
      tab: 'berita',
      variant: 'primary',
    },
    {
      icon: 'RiImageAddLine',
      label: 'Tembahan Fato/Witte',
      tab: 'galeri',
      variant: 'success',
    },
    {
      icon: 'RiCalendarEventLine',
      label: 'Tembahan Agenda',
      tab: 'agenda',
      variant: 'secondary',
    },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <p>Memuat data...</p>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex justify-center items-center h-40">
          <p>Tidak ada data tersedia</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'berita':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-2">Berita & Pengumuman</h3>
            {data.map(item => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {item.gambar && (
                    <img 
                      src={item.gambar} 
                      alt={item.judul} 
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold">{item.judul}</h4>
                    <p className="text-gray-600">{item.deskripsi}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <input type="checkbox" className="mr-2" />
                      <span>{item.tanggal}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'galeri':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-2">Galeri</h3>
            <div className="grid grid-cols-2 gap-4">
              {data.map(item => (
                <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={item.gambar} 
                    alt={item.judul} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-sm">{item.judul}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'agenda':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-2">Agenda</h3>
            {data.map(item => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-bold">{item.judul}</h4>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <input type="checkbox" className="mr-2" />
                  <span>{item.tanggal}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span>{item.lokasi}</span>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative">
        <Button
          onClick={onClose}
          variant="tertiary"
          iconOnly
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          leftIcon="IoClose"
        />
        
        <h2 className="text-lg font-semibold text-center mb-4">Tambah Data Cepat</h2>

        <div className="flex gap-3 mb-6">
          {shortcuts.map((item, idx) => (
            <Button
              key={idx}
              onClick={() => setActiveTab(item.tab)}
              variant={activeTab === item.tab ? item.variant : 'outline'}
              size="small"
              className="flex-1 justify-center gap-2"
              leftIcon={item.icon}
              label={item.label}
            />
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto mb-4">
          {renderContent()}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleAddData}
            variant="add"
            iconVariant="add"
            label={`Tambah ${activeTab === 'berita' ? 'Berita & Pengumuman' : activeTab === 'galeri' ? 'Galeri' : 'Agenda'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AddShortcutModal;