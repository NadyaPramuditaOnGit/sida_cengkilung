import { useEffect, useState } from "react";
import logoDesa from "./assets/LOGO DESA ADAT CENGKILUNG.png"; // Pastikan path

const LoadingPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full h-screen bg-primary2-tint3 flex items-center justify-center">
      <img
        src={logoDesa}
        alt="Logo Desa Adat Cengkilung"
        className={`w-[120px] h-[120px] transition-opacity duration-700 ${
          visible ? "opacity-100 animate-feed" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default LoadingPage;
