-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Waktu pembuatan: 15 Jul 2025 pada 05.56
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `desa_adat_cengkilung_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_desa`
--

CREATE TABLE `data_desa` (
  `id_data` int(11) NOT NULL,
  `jenis_data` enum('Kependudukan','Agama','Pekerjaan','Pendidikan','Usia','Status') NOT NULL,
  `jumlah_laki` int(11) DEFAULT 0,
  `jumlah_perempuan` int(11) DEFAULT 0,
  `total` int(11) GENERATED ALWAYS AS (`jumlah_laki` + `jumlah_perempuan`) STORED,
  `tahun` year(4) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `diperbarui_oleh` int(11) DEFAULT NULL,
  `diperbarui_pada` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `data_desa`
--

INSERT INTO `data_desa` (`id_data`, `jenis_data`, `jumlah_laki`, `jumlah_perempuan`, `tahun`, `keterangan`, `diperbarui_oleh`, `diperbarui_pada`) VALUES
(1, 'Kependudukan', 375, 345, '2024', 'Warga Asli', 3, '2025-07-11 10:48:13'),
(2, 'Kependudukan', 100, 100, '2024', 'Pendatang', 3, '2025-07-11 10:48:13'),
(10, 'Agama', 400, 360, '2024', 'Hindu', 3, '2025-07-11 10:48:13'),
(11, 'Agama', 75, 85, '2024', 'Islam', 3, '2025-07-11 10:48:13'),
(12, 'Agama', 0, 0, '2024', 'Kristen', 3, '2025-07-11 10:48:13'),
(13, 'Agama', 0, 0, '2024', 'Katholik', 3, '2025-07-11 10:48:13'),
(14, 'Agama', 0, 0, '2024', 'Budha', 3, '2025-07-11 10:48:13'),
(20, 'Pekerjaan', 250, 220, '2024', 'Petani', 3, '2025-07-15 03:55:36'),
(21, 'Pekerjaan', 100, 110, '2024', 'Karyawan Swasta', 3, '2025-07-15 03:55:36'),
(22, 'Pekerjaan', 45, 35, '2024', 'Buruh Kasar', 3, '2025-07-15 03:55:36'),
(23, 'Pekerjaan', 20, 25, '2024', 'Pendidikan', 3, '2025-07-15 03:55:36'),
(24, 'Pekerjaan', 20, 10, '2024', 'Pemerintahan', 3, '2025-07-15 03:55:36'),
(25, 'Pekerjaan', 25, 30, '2024', 'Pedagang', 3, '2025-07-15 03:55:36'),
(26, 'Pekerjaan', 0, 10, '2024', 'Ibu Rumah Tangga', 3, '2025-07-15 03:55:36'),
(27, 'Pekerjaan', 15, 5, '2024', 'Lainnya', 3, '2025-07-15 03:55:36'),
(30, 'Pendidikan', 50, 40, '2024', 'Belum Sekolah', 3, '2025-07-15 03:55:36'),
(31, 'Pendidikan', 80, 90, '2024', 'Belum Tamat SD', 3, '2025-07-15 03:55:36'),
(32, 'Pendidikan', 150, 130, '2024', 'SD Sederajat', 3, '2025-07-15 03:55:36'),
(33, 'Pendidikan', 40, 35, '2024', 'SMP Sederajat', 3, '2025-07-15 03:55:36'),
(34, 'Pendidikan', 35, 45, '2024', 'SMA/SMK Sederajat', 3, '2025-07-15 03:55:36'),
(35, 'Pendidikan', 30, 20, '2024', 'Diploma I/II', 3, '2025-07-15 03:55:36'),
(36, 'Pendidikan', 25, 35, '2024', 'Diploma III/Strata I', 3, '2025-07-15 03:55:36'),
(37, 'Pendidikan', 20, 15, '2024', 'Strata II', 3, '2025-07-15 03:55:36'),
(38, 'Pendidikan', 20, 15, '2024', 'Strata III', 3, '2025-07-15 03:55:36'),
(39, 'Pendidikan', 25, 20, '2024', 'Lainnya', 3, '2025-07-15 03:55:36'),
(40, 'Usia', 110, 100, '2024', '0-14 Tahun', 3, '2025-07-15 03:55:36'),
(41, 'Usia', 135, 125, '2024', '15-29 Tahun', 3, '2025-07-15 03:55:36'),
(42, 'Usia', 100, 95, '2024', '30-44 Tahun', 3, '2025-07-15 03:55:36'),
(43, 'Usia', 80, 75, '2024', '45-59 Tahun', 3, '2025-07-15 03:55:36'),
(44, 'Usia', 50, 50, '2024', '60+ Tahun', 3, '2025-07-15 03:55:36'),
(50, 'Status', 200, 180, '2024', 'Belum Menikah', 3, '2025-07-11 10:48:13'),
(51, 'Status', 250, 240, '2024', 'Menikah', 3, '2025-07-11 10:48:13'),
(52, 'Status', 20, 15, '2024', 'Cerai Hidup', 3, '2025-07-11 10:48:13'),
(53, 'Status', 5, 10, '2024', 'Cerai Mati', 3, '2025-07-11 10:48:13');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `data_desa`
--
ALTER TABLE `data_desa`
  ADD PRIMARY KEY (`id_data`),
  ADD KEY `diperbarui_oleh` (`diperbarui_oleh`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `data_desa`
--
ALTER TABLE `data_desa`
  MODIFY `id_data` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `data_desa`
--
ALTER TABLE `data_desa`
  ADD CONSTRAINT `data_desa_ibfk_1` FOREIGN KEY (`diperbarui_oleh`) REFERENCES `pengguna` (`id_pengguna`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
