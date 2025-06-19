import React from 'react';
import { FaFacebook, FaYoutube, FaGlobe } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-primary-tint3 text-primary-shade5 font-roboto font-medium pt-8 pb-4 px-6 md:px-20">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* Kiri */}
        <div className="md:w-1/2 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="Logo Desa"
              className="w-12 h-12"
            />
            <h1 className="font-bold text-lg">DESA ADAT CENGKILUNG</h1>
          </div>

          <div className="flex items-start gap-2">
            <MdLocationOn className="mt-1 text-xl" />
            <p>
              Jl. Cekomaria II No. 999 B, Br. Cengkilung, Peguyangan Kangin,
              <br/>
              Kec. Denpasar Utara, Kota Denpasar, Bali 80115
            </p>
          </div>

          <div className="flex items-center gap-2">
            <MdPhone />
            <span>082236624414</span>
          </div>

          <div className="flex items-center gap-2">
            <MdEmail />
            <span>desaadatcengkilung@gmail.com</span>
          </div>

          <a
            href="https://sidacengkilung.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-shade1 hover:underline gap-2"
            >
            sidacengkilung.id
         </a>

          <div className="flex items-center gap-3 mt-2">
            <span>Follow Us :</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-xl" />
            </a>
            <a href="https://www.youtube.com/@banjarcengkilung6768" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-xl" />
            </a>
          </div>
        </div>

        {/* Tengah */}
        <div className="md:w-1/6 space-y-2">
          <h2 className="font-roboto font-semibold mb-2">Tentang Situs</h2>
          <ul className="space-y-1">
            <li><a href="/sejarah" className="hover:underline">Sejarah</a></li>
            <li><a href="/galeri" className="hover:underline">Galeri</a></li>
            <li><a href="/info" className="hover:underline">Info Desa Adat</a></li>
          </ul>
        </div>

        {/* Kanan - Google Maps */}
        <div className="md:w-1/3 space-y-2">
        <iframe
            title="Lokasi Desa Adat Cengkilung"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126202.5953931502!2d115.16521642006708!3d-8.621069449437473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23fbbefb2bb13%3A0x9b1b0ec85bdbcb71!2sC62H%2BW9M%2C%20Peguyangan%20Kangin%2C%20Kec.%20Denpasar%20Utara%2C%20Kota%20Denpasar%2C%20Bali%2080238!5e0!3m2!1sid!2sid!4v1718775423005!5m2!1sid!2sid"
            width="100%"
            height="200"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg shadow-md"
        ></iframe>
        
        <a
            href="https://maps.app.goo.gl/8CXz6KjGrMx5tDTd9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-blue-600 underline hover:text-blue-800"
        >
            Buka di Google Maps
        </a>
        </div>
      </div>

      <div className="border-t border-blue-300 mt-6 pt-3 text-center text-sm font-semibold font-roboto text-blue-800">
        &copy; Copyright 2025 SIDA Cengkilung. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;