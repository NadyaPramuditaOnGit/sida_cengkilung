import React from 'react';

const HorizontalScroller = ({ title, data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-roboto font-bold mb-2">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {data.map((item, idx) => (
          <div key={idx} className="min-w-[200px] shadow-md bg-netural-white rounded-md overflow-hidden">
            <img src={item.thumbnail} alt={item.title} className="h-36 w-full object-cover" />
            <div className="p-2 text-sm font-medium text-netural-charcol-grey font-roboto line-clamp-2">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScroller;