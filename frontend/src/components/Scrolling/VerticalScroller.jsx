const VerticalScroller = ({ title, data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold font-roboto mb-2">{title}</h2>
      <div className="flex flex-col space-y-4 overflow-y-auto max-h-[80vh] pr-2">
        {data.map((item, idx) => (
          <div key={idx} className="shadow-md bg-netural-white rounded-md overflow-hidden flex">
            <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover flex-shrink-0" />
            <div className="p-2 text-sm font-medium text-netural-charcol-grey font-roboto line-clamp-2">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalScroller;