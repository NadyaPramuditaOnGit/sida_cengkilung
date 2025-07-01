import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { RiArrowDropRightLine } from '@remixicon/react';

const HeroBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: '/assets/banjar-cengkilung.jpg',
      alt: 'Hero Image 1',
    },
    {
      src: '/assets/beji-1.jpg',
      alt: 'Hero Image 2',
    },
    {
      src: '/assets/pura-desa-cengkilung1.png',
      alt: 'Hero Image 3',
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[960px] overflow-hidden">
      {/* Background Slideshow */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="object-cover w-full h-full"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Konten Teks & Tombol */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 bg-black/50">
        <div className="text-white max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold font-lato leading-snug">
            SELAMAT DATANG <br />
            DI WEBSITE DESA ADAT CENGKILUNG
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-roboto">
            Inilah pusat informasi dan komunikasi warga desa adat Cengkilung.
            Dari tradisi hingga pengumuman penting, semuanya tersaji dengan mudah dan cepat.
          </p>

          <div className="flex justify-center">
            <Button
              label="Telusuri"
              rightIcon= "RiArrowRightSLine"
              onClick={() => window.location.href = '/profil-desa'}
              size="medium"
              variant="primary"
              className="font-roboto"
            />
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentImageIndex ? 'bg-netural-white' : 'bg-netural-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;