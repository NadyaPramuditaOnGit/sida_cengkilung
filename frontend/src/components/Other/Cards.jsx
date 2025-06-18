import React from 'react';
import { CalendarDays } from 'lucide-react';
import TextButton from '../Button/TextButton';

const Card = ({ title, content, date, thumbnail }) => {
  return (
    <div className="flex gap-4 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      {/* Gambar thumbnail */}
      <img
        src={thumbnail}
        alt={title}
        className="w-[250px] h-[150px] object-cover rounded-b-sm flex-shrink-0"
      />

      {/* Konten */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-bold text-neutral-charcoal-grey font-roboto">{title}</h3>
          <div className="text-sm font-roboto text-info-shade5 flex items-center gap-1 mt-1 mb-2">
            <CalendarDays className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}</span>
          </div>
          <p className="text-md text-neutral-charcoal-grey font-roboto line-clamp-3">{content}</p>
        </div>

        {/* Tombol */}
        <TextButton
          label="Baca Selengkapnya"
          size="sm"
          fullWidth={true}
          textAlign="center"
        />
      </div>
    </div>
  );
};

export default Card;