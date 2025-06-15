import React, { useState } from "react";
import InputField from "./components/InputField/InputField";
import Button from "./components/Button/Button";

const App = () => {
  const [nama, setNama] = useState("");
  const [file, setFile] = useState(null);
  const [respon, setRespon] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama || !file) {
      alert("Nama dan file wajib diisi.");
      return;
    }

    // Simulasi log
    console.log("Data dikirim:");
    console.log("Nama:", nama);
    console.log("File:", file.name);

    setRespon("Berhasil mengirim data");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">Form Upload</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <InputField
            title="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={nama}
            onChange={(val) => setNama(val)}
            required
            showIcon={true}
            iconPosition="left"
            showHelpText={true}
            helpText="Nama sesuai KTP"
            size="large"
          />

          {/* Input File */}
          <InputField
            title="Dokumen"
            type="file"
            placeholder="Unggah dokumen..."
            name="dokumen"
            onChange={(file) => setFile(file)}
            required
            showIcon={true}
            iconPosition="right"
            showHelpText={true}
            helpText="Format: PDF, JPG, PNG"
            size="large"
          />

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Kirim
          </button>
        </form>

        {/* Hasil */}
        {respon && (
          <div className="text-center text-green-600 font-medium mt-2">
            ✅ {respon}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
