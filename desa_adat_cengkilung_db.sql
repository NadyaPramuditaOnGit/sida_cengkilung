-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 02, 2025 at 12:01 PM
-- Server version: 9.3.0
-- PHP Version: 8.3.21

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
-- Table structure for table `agenda_desa`
--

CREATE TABLE `agenda_desa` (
  `id_agenda` int NOT NULL,
  `judul_kegiatan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `waktu` time DEFAULT NULL,
  `lokasi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `jenis_kegiatan` enum('Adat','Sosial','Keagamaan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_konten` int DEFAULT NULL,
  `dibuat_oleh` int NOT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gambar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agenda_desa`
--

INSERT INTO `agenda_desa` (`id_agenda`, `judul_kegiatan`, `tanggal`, `waktu`, `lokasi`, `deskripsi`, `jenis_kegiatan`, `id_konten`, `dibuat_oleh`, `dibuat_pada`, `diperbarui_pada`, `gambar`) VALUES
(1, 'Musyawarah Desa Update', '2025-07-05', '14:00:00', 'Aula Desa', 'Update agenda: musyawarah dilanjutkan untuk persiapan hari raya.', 'Adat', 7, 3, '2025-06-24 13:24:13', '2025-07-02 09:48:59', '/uploads/agenda/agenda_1751449739564.webp'),
(2, 'Rapat Warga', '2025-07-01', '10:00:00', 'Balai Desa', 'Pertemuan warga membahas pembangunan', 'Sosial', 6, 3, '2025-06-27 16:46:09', '2025-06-27 16:46:09', '/uploads/agenda/gambar-1751042769344-879123607.png'),
(4, 'Musyawarah Desa', '2025-07-05', '10:00:00', 'Balai Banjar', 'Diskusi antara warga desa untuk membahas kegiatan pembangunan.', 'Sosial', 6, 3, '2025-07-02 09:48:27', '2025-07-02 09:48:27', '/uploads/agenda/agenda_1751449707933.jpg'),
(5, 'Musyawarah Desa', '2025-07-05', '10:00:00', 'Balai Banjar', 'Diskusi antara warga desa untuk membahas kegiatan pembangunan.', 'Sosial', 6, 3, '2025-07-02 11:08:03', '2025-07-02 11:08:03', '/uploads/agenda/agenda_1751454483412.jpg'),
(6, 'Musyawarah Desa', '2025-07-05', '10:00:00', 'Balai Banjar', 'Diskusi antara warga desa untuk membahas kegiatan pembangunan.', 'Sosial', 6, 3, '2025-07-02 11:25:35', '2025-07-02 11:25:35', '/uploads/agenda/agenda_1751455535535.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `beranda`
--

CREATE TABLE `beranda` (
  `id` int NOT NULL,
  `bagian` enum('Hero Banner','Berita Terkini','Video Kegiatan','Sejarah Singkat','Statistik Desa') COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `konten` text COLLATE utf8mb4_unicode_ci,
  `lokasi_gambar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_video` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teks_tombol` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tautan_tombol` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urutan_tampil` int DEFAULT '0',
  `aktif` tinyint(1) DEFAULT '1',
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `beranda`
--

INSERT INTO `beranda` (`id`, `bagian`, `judul`, `konten`, `lokasi_gambar`, `url_video`, `teks_tombol`, `tautan_tombol`, `urutan_tampil`, `aktif`, `dibuat_pada`, `diperbarui_pada`) VALUES
(2, 'Hero Banner', 'Selamat Datang di Desa Cengkilung', 'Desa kami penuh dengan semangat gotong royong.', 'uploads/banner.jpg', NULL, 'Jelajahi', '/tentang-desa', 1, 1, '2025-06-26 11:34:39', '2025-06-26 11:34:39');

-- --------------------------------------------------------

--
-- Table structure for table `data_desa`
--

CREATE TABLE `data_desa` (
  `id_data` int NOT NULL,
  `jenis_data` enum('Kependudukan','Agama','Pekerjaan','Pendidikan','Usia','Status') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah_laki` int DEFAULT '0',
  `jumlah_perempuan` int DEFAULT '0',
  `total` int GENERATED ALWAYS AS ((`jumlah_laki` + `jumlah_perempuan`)) STORED,
  `tahun` year DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `diperbarui_oleh` int DEFAULT NULL,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `data_desa`
--

INSERT INTO `data_desa` (`id_data`, `jenis_data`, `jumlah_laki`, `jumlah_perempuan`, `tahun`, `keterangan`, `diperbarui_oleh`, `diperbarui_pada`) VALUES
(3, 'Pekerjaan', 200, 180, '2025', 'Data pekerjaan utama penduduk desa.', 3, '2025-06-26 12:25:39'),
(4, 'Usia', 125, 135, '2024', 'Data warga asli (updated)', 3, '2025-07-02 09:55:22'),
(5, 'Kependudukan', 300, 250, '2024', 'Data awal tahun 2024', 3, '2025-06-28 11:34:17'),
(6, 'Kependudukan', 120, 130, '2024', 'Data warga asli', 3, '2025-07-02 09:55:09'),
(7, 'Kependudukan', 80, 100, '2024', 'Data pendatang', 3, '2025-07-02 09:55:11'),
(8, 'Kependudukan', 120, 130, '2024', 'Data warga asli', 3, '2025-07-02 10:29:49');

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_desa`
--

CREATE TABLE `dokumen_desa` (
  `id_dokumen` int NOT NULL,
  `judul` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_modifikasi` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tanggal_dokumen` date NOT NULL,
  `lokasi_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` enum('Surat','Laporan','Arsip','Regulasi') COLLATE utf8mb4_unicode_ci NOT NULL,
  `diunggah_oleh` int NOT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dokumen_desa`
--

INSERT INTO `dokumen_desa` (`id_dokumen`, `judul`, `tanggal_modifikasi`, `tanggal_dokumen`, `lokasi_file`, `kategori`, `diunggah_oleh`, `dibuat_pada`) VALUES
(3, 'Contoh Dokumen Desa', '2025-07-02 10:55:52', '2024-07-02', '/uploads/dokumen/dokumen-1751453752697-791562281.pdf', 'Surat', 2, '2025-07-02 10:55:52');

-- --------------------------------------------------------

--
-- Table structure for table `galeri_desa`
--

CREATE TABLE `galeri_desa` (
  `id_galeri` int NOT NULL,
  `judul` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `tanggal_upload` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `kategori` enum('Keagamaan','Kesenian','Kegiatan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_media` enum('Foto','Video') COLLATE utf8mb4_unicode_ci NOT NULL,
  `lokasi_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_konten` int DEFAULT NULL,
  `diunggah_oleh` int NOT NULL,
  `tag` json DEFAULT NULL,
  `unggulan` tinyint(1) DEFAULT '0',
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `galeri_desa`
--

INSERT INTO `galeri_desa` (`id_galeri`, `judul`, `deskripsi`, `tanggal_upload`, `kategori`, `jenis_media`, `lokasi_file`, `id_konten`, `diunggah_oleh`, `tag`, `unggulan`, `dibuat_pada`, `diperbarui_pada`) VALUES
(7, 'Upacara Adat', 'Galeri foto kegiatan upacara adat', '2025-06-27 16:00:00', 'Keagamaan', 'Foto', 'http://localhost:3000/uploads/galeri/1751178605108-26652808.png', NULL, 3, '[\"adat\", \"budaya\"]', 1, '2025-06-29 06:30:05', '2025-06-29 06:30:05'),
(8, 'Upacara Adat', 'Galeri foto kegiatan upacara adat', '2025-06-27 16:00:00', 'Keagamaan', 'Foto', 'http://localhost:3000/uploads/galeri/1751178605111-711597011.png', NULL, 3, '[\"adat\", \"budaya\"]', 1, '2025-06-29 06:30:05', '2025-06-29 06:30:05'),
(12, 'Upacara Melasti', 'Prosesi sakral sebelum Nyepi.', '2025-06-30 16:00:00', 'Keagamaan', 'Foto', 'http://localhost:3000/uploads/galeri/1751448777496-667343587.png', 6, 3, '[\"melasti\", \"adat\"]', 1, '2025-07-02 09:32:57', '2025-07-02 09:32:57'),
(13, 'Upacara Melasti', 'Prosesi sakral sebelum Nyepi.', '2025-06-30 16:00:00', 'Keagamaan', 'Foto', 'http://localhost:3000/uploads/galeri/1751448906782-944303888.png', 6, 3, '[\"melasti\", \"adat\"]', 1, '2025-07-02 09:35:06', '2025-07-02 09:35:06');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_konten`
--

CREATE TABLE `kategori_konten` (
  `id_kategori` int NOT NULL,
  `nama_kategori` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_kategori` enum('Berita','Pengumuman','Dokumen','Galeri') COLLATE utf8mb4_unicode_ci NOT NULL,
  `induk_id` int DEFAULT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategori_konten`
--

INSERT INTO `kategori_konten` (`id_kategori`, `nama_kategori`, `jenis_kategori`, `induk_id`, `dibuat_pada`) VALUES
(2, 'Berita Update', 'Berita', NULL, '2025-06-23 18:45:35'),
(5, 'Berita1', 'Berita', NULL, '2025-06-26 13:21:26');

-- --------------------------------------------------------

--
-- Table structure for table `konten`
--

CREATE TABLE `konten` (
  `id_konten` int NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskripsi` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `konten` longtext COLLATE utf8mb4_unicode_ci,
  `tanggal_publish` datetime DEFAULT CURRENT_TIMESTAMP,
  `kategori` enum('Berita','Pengumuman','Sejarah') COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_sub_kategori` int DEFAULT NULL,
  `id_penulis` int NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Draft','Published','Archived') COLLATE utf8mb4_unicode_ci DEFAULT 'Draft',
  `jumlah_dilihat` int DEFAULT '0',
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `konten`
--

INSERT INTO `konten` (`id_konten`, `judul`, `slug`, `deskripsi`, `konten`, `tanggal_publish`, `kategori`, `id_sub_kategori`, `id_penulis`, `thumbnail`, `status`, `jumlah_dilihat`, `dibuat_pada`, `diperbarui_pada`) VALUES
(6, 'Lomba 17 Agustus', 'lomba-17-agustus', 'Desa mengadakan lomba kemerdekaan', NULL, '2025-06-26 21:35:38', 'Sejarah', 2, 1, 'https://example.com/thumb.jpg', 'Draft', 0, '2025-06-26 13:35:38', '2025-06-29 08:41:16'),
(7, 'Lomba 17 Agustus', 'lomba-17-agustus-1', 'Desa mengadakan lomba kemerdekaan', NULL, '2025-06-27 00:25:31', 'Berita', 2, 1, '/uploads/thumbnails/thumbnail-1750955131138-43227376.png', 'Draft', 0, '2025-06-26 16:25:31', '2025-06-26 16:25:31'),
(8, 'Lomba 17 Agustus (2)', 'lomba-17-agustus-2', 'Desa mengadakan lomba kemerdekaan', NULL, '2025-06-27 00:32:30', 'Berita', 2, 1, '/uploads/thumbnails/thumbnail-1750955550191-60021595.png', 'Draft', 0, '2025-06-26 16:32:30', '2025-06-26 16:32:30'),
(9, 'Judul Berita Update', 'judul-berita-update', 'Berita sudah diupdate isinya', NULL, '2025-06-28 00:00:00', 'Berita', NULL, 3, 'http://localhost:3000/uploads/thumbnails/1751175332403-391295489.png', 'Archived', 0, '2025-06-29 05:16:46', '2025-06-29 05:35:32'),
(10, 'Judul Berita Tes', 'judul-berita-tes', 'Isi lengkap berita yang sangat informatif.', NULL, '2025-06-28 00:00:00', 'Berita', NULL, 3, 'http://localhost:3000/uploads/thumbnails/1751175322438-302776652.png', 'Published', 0, '2025-06-29 05:35:22', '2025-06-29 05:35:22'),
(11, 'Sejarah Desa Adat Cengkilung', 'sejarah-desa-adat-cengkilung', 'Desa Adat Cengkilung didirikan pada abad ke-17 dan memiliki sejarah panjang test test test test test test test', NULL, '2025-06-29 10:00:00', 'Sejarah', NULL, 3, 'http://localhost:3000/uploads/thumbnails/1751175322438-302776652.png', 'Published', 0, '2025-06-29 08:46:45', '2025-06-29 08:53:19'),
(13, '[UPDATE] Sosialisasi dari Dinas Kebudayaan', 'update-sosialisasi-dari-dinas-kebudayaan', 'Deskripsi baru setelah update...', 'Isi konten update-nya panjang di sini...', '2025-07-02 00:00:00', 'Pengumuman', NULL, 3, 'http://localhost:3000/uploads/thumbnails/1751446861896-850366693.jpg', 'Published', 0, '2025-07-02 09:00:48', '2025-07-02 09:01:01');

-- --------------------------------------------------------

--
-- Table structure for table `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id_log` int NOT NULL,
  `id_pengguna` int DEFAULT NULL,
  `jenis_log` enum('Login Pengguna') COLLATE utf8mb4_unicode_ci NOT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `log_aktivitas`
--

INSERT INTO `log_aktivitas` (`id_log`, `id_pengguna`, `jenis_log`, `dibuat_pada`) VALUES
(1, 1, 'Login Pengguna', '2025-06-26 11:43:48'),
(2, 3, 'Login Pengguna', '2025-06-26 12:04:33'),
(3, 3, 'Login Pengguna', '2025-06-26 12:10:13'),
(4, 3, 'Login Pengguna', '2025-06-26 13:03:38'),
(5, 3, 'Login Pengguna', '2025-06-26 13:19:59'),
(6, 1, 'Login Pengguna', '2025-06-26 16:33:16'),
(7, 3, 'Login Pengguna', '2025-06-26 16:33:20'),
(8, 3, 'Login Pengguna', '2025-06-27 16:04:55'),
(9, 3, 'Login Pengguna', '2025-06-28 10:45:00'),
(10, 3, 'Login Pengguna', '2025-06-28 11:04:08'),
(11, 2, 'Login Pengguna', '2025-06-29 11:19:10'),
(12, 1, 'Login Pengguna', '2025-06-29 13:11:16'),
(13, 1, 'Login Pengguna', '2025-07-01 13:49:09'),
(14, 2, 'Login Pengguna', '2025-07-01 13:49:11'),
(15, 3, 'Login Pengguna', '2025-07-01 13:49:14'),
(16, 1, 'Login Pengguna', '2025-07-01 14:26:42'),
(17, 1, 'Login Pengguna', '2025-07-01 15:25:11'),
(18, 1, 'Login Pengguna', '2025-07-01 15:44:23'),
(19, 3, 'Login Pengguna', '2025-07-02 08:55:24'),
(20, 2, 'Login Pengguna', '2025-07-02 10:38:17'),
(21, 3, 'Login Pengguna', '2025-07-02 10:43:03'),
(22, 2, 'Login Pengguna', '2025-07-02 11:21:34'),
(23, 3, 'Login Pengguna', '2025-07-02 11:22:05'),
(24, 1, 'Login Pengguna', '2025-07-02 11:47:55');

-- --------------------------------------------------------

--
-- Table structure for table `masukan_warga`
--

CREATE TABLE `masukan_warga` (
  `id_masukan` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_hp` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subjek` enum('Kritik','Saran','Laporan','Pertanyaan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `pesan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Baru','Diproses','Selesai') COLLATE utf8mb4_unicode_ci DEFAULT 'Baru',
  `tanggapan` text COLLATE utf8mb4_unicode_ci,
  `alamat_ip` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `masukan_warga`
--

INSERT INTO `masukan_warga` (`id_masukan`, `nama`, `email`, `no_hp`, `subjek`, `pesan`, `status`, `tanggapan`, `alamat_ip`, `dibuat_pada`, `diperbarui_pada`) VALUES
(1, 'Dewi', 'dewi@example.com', '08123456789', 'Saran', 'Mohon ditambahkan tempat sampah di dekat balai desa.', 'Selesai', 'Terima kasih atas masukannya, akan segera kami tindak lanjuti.', '::ffff:127.0.0.1', '2025-06-25 06:29:42', '2025-06-25 06:30:01'),
(2, 'Dewi', 'dewi@example.com', '08123456789', 'Saran', 'Mohon ditambahkan tempat sampah di dekat balai desa.', 'Baru', NULL, '::ffff:127.0.0.1', '2025-07-02 11:06:02', '2025-07-02 11:06:02');

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id_pengguna` int NOT NULL,
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_pengguna` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kata_sandi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Aktif','Non-Aktif') COLLATE utf8mb4_unicode_ci DEFAULT 'Aktif',
  `foto_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `login_terakhir` timestamp NULL DEFAULT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`id_pengguna`, `nik`, `nama_lengkap`, `tanggal_lahir`, `email`, `no_hp`, `nama_pengguna`, `kata_sandi`, `status`, `foto_profil`, `jabatan`, `alamat`, `login_terakhir`, `dibuat_pada`, `diperbarui_pada`) VALUES
(1, '1111111111111111', 'Ayu Warga', '1990-01-01', 'ayuvirgiana10@gmail.com', '081234567891', 'ayuwarga', '$2b$10$aUltCoRGvzVyJHWGPKTTS.jXzSzfcPui4v44h1f.ykb60rBOTOuWu', 'Aktif', 'uploads/foto/ayuwarga.jpg', 'Warga Biasa', 'Dusun I, RT 01 RW 01', '2025-07-02 11:47:55', '2025-06-21 17:48:00', '2025-07-02 11:47:55'),
(2, '2222222222222222', 'Budi Perangkat', '1985-05-10', 'budi.perangkat@desa.id', '081298765432', 'budiperangkat', '$2b$10$ptKHje9GnKdo105z6fic5eneibSs6Z9AHS9a5yZLwVM6Ee.FgkvT2', 'Aktif', 'uploads/foto/budiperangkat.jpg', 'Sekretaris Desa', 'Dusun II, RT 02 RW 01', '2025-07-02 11:21:34', '2025-06-21 17:48:06', '2025-07-02 11:21:34'),
(3, '3333333333333333', 'Citra Admin', '1980-07-15', 'citra.admin@desa.id', '081312345678', 'citraadmin', '$2b$10$uiu1AlwJTkJIIiX945nPye5wZgWWmvj7F572bq2R.WBo/dFMv/zKS', 'Aktif', 'uploads/foto/citraadmin.jpg', 'Admin Website', 'Kantor Desa, Jalan Utama', '2025-07-02 11:22:05', '2025-06-21 17:48:10', '2025-07-02 11:22:05'),
(4, '1234567890123456', 'Test User Update', '1990-01-01', 'testuserupdate@example.com', '081234567891', 'testuserupdate', '$2b$10$8.OGDml1Pk4dkqZmS1MZVeI35oHqs5xw0zFgP60JCI3NSPhADDE1e', 'Non-Aktif', NULL, 'Staff Updated', 'Jl. Contoh No 2', NULL, '2025-06-28 16:11:53', '2025-06-28 16:12:48'),
(5, '4444444444444444', 'User Update Foto', '1991-02-01', 'userupdate@example.com', '081234567893', 'userupload', '$2b$10$C6/kxRSyK2vyvz81rhp6ceFxhJrcTe87nq5EH4C.zpsBprDw3YXBG', 'Non-Aktif', '1751128788314-262599527.png', 'Updater', 'Jl. Baru Upload Foto', NULL, '2025-06-28 16:38:46', '2025-06-28 16:39:48');

-- --------------------------------------------------------

--
-- Table structure for table `peran`
--

CREATE TABLE `peran` (
  `id` int NOT NULL,
  `nama_peran` enum('Admin','Perangkat_Desa','Penduduk') COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peran`
--

INSERT INTO `peran` (`id`, `nama_peran`) VALUES
(1, 'Admin'),
(2, 'Perangkat_Desa'),
(3, 'Penduduk');

-- --------------------------------------------------------

--
-- Table structure for table `perangkat_desa`
--

CREATE TABLE `perangkat_desa` (
  `id_perangkat` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lokasi_foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urutan_tampil` int DEFAULT '0',
  `kontak` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `masa_jabatan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peran_pengguna`
--

CREATE TABLE `peran_pengguna` (
  `id` int NOT NULL,
  `id_pengguna` int NOT NULL,
  `id_peran` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peran_pengguna`
--

INSERT INTO `peran_pengguna` (`id`, `id_pengguna`, `id_peran`) VALUES
(1, 1, 3),
(2, 2, 2),
(3, 3, 1),
(4, 4, 2),
(5, 5, 2);

-- --------------------------------------------------------

--
-- Table structure for table `profil_desa`
--

CREATE TABLE `profil_desa` (
  `id_profil` int NOT NULL,
  `bagian` enum('Sejarah','VisiMisi','StrukturOrganisasi','PerangkatDesa') COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `konten` longtext COLLATE utf8mb4_unicode_ci,
  `lokasi_gambar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urutan_tampil` int DEFAULT '0',
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profil_desa`
--

INSERT INTO `profil_desa` (`id_profil`, `bagian`, `judul`, `konten`, `lokasi_gambar`, `urutan_tampil`, `dibuat_pada`, `diperbarui_pada`) VALUES
(1, 'Sejarah', 'https://www.youtube.com/watch?v=dummy-url', 'Ini adalah deskripsi baru tentang sejarah desa.', 'uploads/profil/sejarah-update.jpg', 1, '2025-06-26 16:34:59', '2025-07-02 11:04:19'),
(2, 'PerangkatDesa', 'Budi Santoso', 'Kepala Desa', '/uploads/profil/kades.jpg', 1, '2025-06-28 12:57:00', '2025-06-28 12:57:00'),
(3, 'PerangkatDesa', 'Siti Aminah', 'Sekretaris Desa', '/uploads/profil/sekretaris.jpg', 2, '2025-06-28 12:57:00', '2025-06-28 12:57:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agenda_desa`
--
ALTER TABLE `agenda_desa`
  ADD PRIMARY KEY (`id_agenda`),
  ADD KEY `id_konten` (`id_konten`),
  ADD KEY `dibuat_oleh` (`dibuat_oleh`);

--
-- Indexes for table `beranda`
--
ALTER TABLE `beranda`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_desa`
--
ALTER TABLE `data_desa`
  ADD PRIMARY KEY (`id_data`),
  ADD KEY `diperbarui_oleh` (`diperbarui_oleh`);

--
-- Indexes for table `dokumen_desa`
--
ALTER TABLE `dokumen_desa`
  ADD PRIMARY KEY (`id_dokumen`),
  ADD KEY `diunggah_oleh` (`diunggah_oleh`);

--
-- Indexes for table `galeri_desa`
--
ALTER TABLE `galeri_desa`
  ADD PRIMARY KEY (`id_galeri`),
  ADD KEY `diunggah_oleh` (`diunggah_oleh`),
  ADD KEY `fk_id_konten` (`id_konten`);

--
-- Indexes for table `kategori_konten`
--
ALTER TABLE `kategori_konten`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `konten`
--
ALTER TABLE `konten`
  ADD PRIMARY KEY (`id_konten`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `id_sub_kategori` (`id_sub_kategori`),
  ADD KEY `id_penulis` (`id_penulis`);

--
-- Indexes for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_pengguna` (`id_pengguna`);

--
-- Indexes for table `masukan_warga`
--
ALTER TABLE `masukan_warga`
  ADD PRIMARY KEY (`id_masukan`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id_pengguna`),
  ADD UNIQUE KEY `nik` (`nik`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nama_pengguna` (`nama_pengguna`);

--
-- Indexes for table `peran`
--
ALTER TABLE `peran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_peran` (`nama_peran`);

--
-- Indexes for table `perangkat_desa`
--
ALTER TABLE `perangkat_desa`
  ADD PRIMARY KEY (`id_perangkat`);

--
-- Indexes for table `peran_pengguna`
--
ALTER TABLE `peran_pengguna`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pengguna_peran` (`id_pengguna`,`id_peran`),
  ADD KEY `idx_user_id` (`id_pengguna`),
  ADD KEY `fk_peran_pengguna` (`id_peran`);

--
-- Indexes for table `profil_desa`
--
ALTER TABLE `profil_desa`
  ADD PRIMARY KEY (`id_profil`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agenda_desa`
--
ALTER TABLE `agenda_desa`
  MODIFY `id_agenda` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `beranda`
--
ALTER TABLE `beranda`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `data_desa`
--
ALTER TABLE `data_desa`
  MODIFY `id_data` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `dokumen_desa`
--
ALTER TABLE `dokumen_desa`
  MODIFY `id_dokumen` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `galeri_desa`
--
ALTER TABLE `galeri_desa`
  MODIFY `id_galeri` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `kategori_konten`
--
ALTER TABLE `kategori_konten`
  MODIFY `id_kategori` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `konten`
--
ALTER TABLE `konten`
  MODIFY `id_konten` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id_log` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `masukan_warga`
--
ALTER TABLE `masukan_warga`
  MODIFY `id_masukan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_pengguna` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `peran`
--
ALTER TABLE `peran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `perangkat_desa`
--
ALTER TABLE `perangkat_desa`
  MODIFY `id_perangkat` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `peran_pengguna`
--
ALTER TABLE `peran_pengguna`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `profil_desa`
--
ALTER TABLE `profil_desa`
  MODIFY `id_profil` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agenda_desa`
--
ALTER TABLE `agenda_desa`
  ADD CONSTRAINT `agenda_desa_ibfk_1` FOREIGN KEY (`id_konten`) REFERENCES `konten` (`id_konten`),
  ADD CONSTRAINT `agenda_desa_ibfk_2` FOREIGN KEY (`dibuat_oleh`) REFERENCES `pengguna` (`id_pengguna`);

--
-- Constraints for table `data_desa`
--
ALTER TABLE `data_desa`
  ADD CONSTRAINT `data_desa_ibfk_1` FOREIGN KEY (`diperbarui_oleh`) REFERENCES `pengguna` (`id_pengguna`);

--
-- Constraints for table `dokumen_desa`
--
ALTER TABLE `dokumen_desa`
  ADD CONSTRAINT `dokumen_desa_ibfk_1` FOREIGN KEY (`diunggah_oleh`) REFERENCES `pengguna` (`id_pengguna`);

--
-- Constraints for table `galeri_desa`
--
ALTER TABLE `galeri_desa`
  ADD CONSTRAINT `fk_id_konten` FOREIGN KEY (`id_konten`) REFERENCES `konten` (`id_konten`),
  ADD CONSTRAINT `galeri_desa_ibfk_1` FOREIGN KEY (`id_konten`) REFERENCES `konten` (`id_konten`),
  ADD CONSTRAINT `galeri_desa_ibfk_2` FOREIGN KEY (`diunggah_oleh`) REFERENCES `pengguna` (`id_pengguna`);

--
-- Constraints for table `konten`
--
ALTER TABLE `konten`
  ADD CONSTRAINT `konten_ibfk_1` FOREIGN KEY (`id_sub_kategori`) REFERENCES `kategori_konten` (`id_kategori`),
  ADD CONSTRAINT `konten_ibfk_2` FOREIGN KEY (`id_penulis`) REFERENCES `pengguna` (`id_pengguna`);

--
-- Constraints for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD CONSTRAINT `log_aktivitas_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`);

--
-- Constraints for table `peran_pengguna`
--
ALTER TABLE `peran_pengguna`
  ADD CONSTRAINT `fk_peran_pengguna` FOREIGN KEY (`id_peran`) REFERENCES `peran` (`id`),
  ADD CONSTRAINT `fk_peran_pengguna_id_pengguna` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
