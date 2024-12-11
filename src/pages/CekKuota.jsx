import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DestinasiWisata from "./DestinasiWisata";
import PanduanBooking from "./PanduanBooking";
import Footer from "../components/Footer";

function CekKuota() {
    const [dataKuota, setDataKuota] = useState([]); // State for storing fetched kuota data
    const [selectedMonth, setSelectedMonth] = useState('11'); // State for selected month

    // Fetch kuota data from API
    useEffect(() => {
        const fetchKuota = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/kuota/all-kuota");
                const data = await response.json();
                
                // Map the API data and convert dates to a proper format
                const formattedData = data.map(item => {
                    const date = new Date(item.tanggal);
                    return {
                        ...item,
                        tanggal: date.toISOString().split('T')[0], // Format the date as 'YYYY-MM-DD'
                    };
                });

                // Set the formatted data to the state
                setDataKuota(formattedData);
            } catch (error) {
                console.error("Error fetching kuota:", error);
            }
        };
        fetchKuota();
    }, []); // This empty array ensures it runs only once when the component mounts

    // Handle the change in month selection
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div className="p-6 pt-20">
            <h2 className="text-2xl font-bold mb-4">Cek Kuota Wisata</h2>

            {/* Dropdown for selecting month */}
            <div className="mb-4">
                <label htmlFor="month" className="mr-2 text-lg">Pilih Bulan:</label>
                <select
                    id="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="01">Januari</option>
                    <option value="02">Februari</option>
                    <option value="03">Maret</option>
                    <option value="04">April</option>
                    <option value="05">Mei</option>
                    <option value="06">Juni</option>
                    <option value="07">Juli</option>
                    <option value="08">Agustus</option>
                    <option value="09">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                </select>
            </div>

            {/* Kuota Wisata Table */}
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border border-gray-300 text-left">Tanggal</th>
                        <th className="px-4 py-2 border border-gray-300 text-left">Destinasi</th>
                        <th className="px-4 py-2 border border-gray-300 text-left">Jumlah Kuota</th>
                        <th className="px-4 py-2 border border-gray-300 text-left">Sisa Kuota</th>
                    </tr>
                </thead>
                <tbody>
                    {dataKuota
                        .filter((item) => {
                            const month = item.tanggal.split('-')[1]; // Extract the month from the date
                            return month === selectedMonth; // Filter based on selected month
                        })
                        .map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border border-gray-300">{item.tanggal}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.destinasi}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.kuota}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.sisa_kuota}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default CekKuota;
