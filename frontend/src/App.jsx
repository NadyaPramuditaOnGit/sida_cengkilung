import EditableTextArea from './components/InputField/TextArea';

const App = () => {
  // Fungsi untuk menyimpan ke database
  const handleSaveToDatabase = async ({ label, value }) => {
    console.log("Data yang akan disimpan:", { label, value });
    
    // Simulasi API call
    try {
      // Ganti dengan kode untuk memanggil API Anda
      // Contoh:
      // const response = await fetch('/api/save-description', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ label, value }),
      // });
      // const data = await response.json();
      
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Data berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan data");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <EditableTextArea 
        initialLabel="Deskripsi Produk"
        initialValue="Ini adalah deskripsi awal..."
        onSave={handleSaveToDatabase}
      />
    </div>
  );
};

export default App;