// utils/formatTanggal.js
const dayjs = require('dayjs');
require('dayjs/locale/id');
dayjs.locale('id');

// Fungsi untuk format timestamp menjadi: Rabu, 29 Juni 2025
const formatTanggalIndonesia = (tanggal) => {
  return dayjs(tanggal).format('dddd, D MMMM YYYY');
};

module.exports = formatTanggalIndonesia;
