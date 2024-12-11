import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrisImage from "../asset/qris.jpg"; // sesuaikan nama file dan path gambar

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    groupSize: "",
    guideOption: "false", // opsi panduan (misalnya: default, local guide, no guide)
    paymentMethod: "QRIS", // Metode pembayaran (misalnya: QRIS, Transfer Bank)
  });
  const [paymentFile, setPaymentFile] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [kuota, setKuota] = useState([]); // Array untuk menyimpan data kuota
  const [selectedKuotaId, setSelectedKuotaId] = useState(null); // Simpan ID kuota yang dipilih
  const navigate = useNavigate();

  // Fetch kuota data from the server
  useEffect(() => {
    const fetchKuota = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/kuota/all-kuota");
        const data = await response.json();
        // Filter kuota where sisa_kuota > 0
        const availableKuota = data.filter(item => item.sisa_kuota > 0);
        setKuota(availableKuota); // Menyimpan data kuota yang tersedia
      } catch (error) {
        console.error("Error fetching kuota:", error);
      }
    };
    fetchKuota();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setPaymentFile(e.target.files[0]);
  };

  const handleKuotaChange = (e) => {
    setSelectedKuotaId(e.target.value); // Menyimpan ID kuota yang dipilih
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSubmit = async () => {
    if (paymentFile) {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.name);
      formDataToSend.append("phoneNumber", formData.phone);
      formDataToSend.append("numberOfTickets", formData.groupSize);
      formDataToSend.append("guideOption", formData.guideOption);
      formDataToSend.append("paymentMethod", formData.paymentMethod);
      formDataToSend.append("qrisProof", paymentFile);
      formDataToSend.append("totalAmount", "100000"); // Gantilah dengan jumlah total yang sesuai
      formDataToSend.append("kuotaId", selectedKuotaId); // Ensure this is a valid ObjectId string
      formDataToSend.append("alamat", formData.address);
  
      try {
        const response = await fetch("http://localhost:5000/api/bookinguser/book-ticket", {
          method: "POST",
          body: formDataToSend,
        });
        const result = await response.json();
        if (response.ok) {
          setShowConfirmation(true);
        } else {
          alert("Pemesanan gagal: " + result.message);
        }
      } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
      }
    } else {
      alert("Unggah bukti pembayaran terlebih dahulu.");
    }
  };
  

  // Fungsi untuk mereset form ke kondisi awal
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      groupSize: "",
      guideOption: "false",
      paymentMethod: "QRIS",
    });
    setSelectedKuotaId(null); // Reset kuota ID
    setShowPayment(false);
    setPaymentFile(null);
    setShowConfirmation(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Pemesanan Tiket</h2>

      {!showPayment ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Nomor Telepon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Alamat</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Masukkan alamat Anda"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Jumlah Rombongan</label>
            <input
              type="number"
              name="groupSize"
              value={formData.groupSize}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Masukkan jumlah rombongan"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Opsi Pemandu</label>
            <select
              name="guideOption"
              value={formData.guideOption}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="true">Pemandu Biasa</option>
              <option value="true">Pemandu Lokal</option>
              <option value="false">Tanpa Pemandu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold">Pilih Kuota</label>
            <select
              name="kuotaId"
              value={selectedKuotaId}
              onChange={handleKuotaChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              {kuota.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.destinasi} - {item.sisa_kuota} kuota tersisa
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Pesan Tiket
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <p>Silahkan pembayaran melalui QRIS yang ada di bawah ini.</p>
          <img src={qrisImage} alt="QRIS Pembayaran" className="mx-auto w-48 mb-4" />
          <div>
            <label className="block text-sm font-semibold mb-2">Unggah Bukti Pembayaran</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handlePaymentSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Konfirmasi Pembayaran
          </button>
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Reset Form
          </button>
        </div>
      )}

      {showConfirmation && (
        <div className="mt-4 text-center text-green-600 font-semibold">
          Pemesanan Anda berhasil! Kami akan mengirimkan detail tiket melalui email.
        </div>
      )}
    </div>
  );
};

export default BookingForm;
