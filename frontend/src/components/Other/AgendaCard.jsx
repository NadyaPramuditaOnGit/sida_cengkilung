import React from 'react';
import { RiMap2Fill, RiCalendarEventFill } from '@remixicon/react';

const AgendaCard = ({ title, location, date, description, thumbnail, link }) => {
  return (
    <a
      href={link}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-blue-800">{title}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1 gap-4">
          <span className="flex items-center"><RiMap2Fill className="mr-1" /> {location}</span>
          <span className="flex items-center"><RiCalendarEventFill className="mr-1" /> {date}</span>
        </div>
        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{description}</p>
      </div>
    </a>
  );
};

export default AgendaCard;
