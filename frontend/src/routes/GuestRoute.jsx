import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';


const Beranda = lazy(() => import('../pages/guest/Beranda'));
const Sejarah = lazy(() => import('../pages/guest/Sejarah'));
const Berita = lazy(() => import('../pages/guest/informasi/Berita'));
const DataDesa = lazy(() => import('../pages/guest/informasi/DataDesa'));
const ProfilDesa = lazy(() => import('../pages/guest/informasi/ProfilDesa'));
const Galeri = lazy(() => import('../pages/guest/Galeri'));

const GuestRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route path="/sejarah" element={<Sejarah />} />
      <Route path="/berita" element={<Berita />} />
      <Route path="/data-desa" element={<DataDesa />} />
      <Route path="/profil-desa" element={<ProfilDesa />} />
      <Route path="/galeri" element={<Galeri />} />
    </Routes>
  );
};

export default GuestRoutes;