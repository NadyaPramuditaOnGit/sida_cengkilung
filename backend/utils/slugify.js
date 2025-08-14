// utils/slugify.js
module.exports = function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Hapus karakter non-alphanumeric
    .replace(/[\s_-]+/g, '-')    // Ganti spasi dan underscore jadi -
    .replace(/^-+|-+$/g, '');    // Hapus tanda - di awal/akhir
};
