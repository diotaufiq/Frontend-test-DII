"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface PatientFormData {
  nama: string;
  nik: string;
  diagnosaMasuk: string;
  tanggalMasuk: string;
  dokterPenanggungJawab: string;
  ruangan: string;
}

interface Patient extends PatientFormData {
  id: string;
  status: 'Aktif' | 'Keluar';
}

// Mock data
const mockPatients: Patient[] = [
  { "id": "1", "nama": "John Smith", "nik": "1234567890123456", "diagnosaMasuk": "Demam Tinggi", "tanggalMasuk": "2024-01-15", "dokterPenanggungJawab": "Dr. Ahmad Susanto", "ruangan": "Ruang Anggrek", "status": "Aktif" },
  { "id": "2", "nama": "Fatoumata Traoré", "nik": "2345678901234567", "diagnosaMasuk": "Hipertensi", "tanggalMasuk": "2024-01-14", "dokterPenanggungJawab": "Dr. Sari Indrawati", "ruangan": "Ruang Melati", "status": "Aktif" },
  { "id": "3", "nama": "Bujang Saleh", "nik": "3456789012345678", "diagnosaMasuk": "Diabetes", "tanggalMasuk": "2024-01-13", "dokterPenanggungJawab": "Dr. Budi Santoso", "ruangan": "VIP A", "status": "Aktif" },
  { "id": "4", "nama": "Emily Johnson", "nik": "4567890123456789", "diagnosaMasuk": "Asma", "tanggalMasuk": "2024-01-12", "dokterPenanggungJawab": "Dr. Maya Sari", "ruangan": "ICU", "status": "Aktif" },
  { "id": "5", "nama": "Michael Brown", "nik": "5678901234567890", "diagnosaMasuk": "Gastritis", "tanggalMasuk": "2024-01-11", "dokterPenanggungJawab": "Dr. Ahmad Susanto", "ruangan": "Ruang Mawar", "status": "Aktif" },
  { "id": "6", "nama": "Chisom Okonkwo", "nik": "6789012345678901", "diagnosaMasuk": "Migrain", "tanggalMasuk": "2024-01-10", "dokterPenanggungJawab": "Dr. Sari Indrawati", "ruangan": "Ruang Anggrek", "status": "Aktif" },
  { "id": "7", "nama": "Upik Rahma", "nik": "7890123456789012", "diagnosaMasuk": "Flu Berat", "tanggalMasuk": "2024-01-09", "dokterPenanggungJawab": "Dr. Budi Santoso", "ruangan": "Ruang Melati", "status": "Aktif" },
  { "id": "8", "nama": "Jessica Davis", "nik": "8901234567890123", "diagnosaMasuk": "Pneumonia", "tanggalMasuk": "2024-01-08", "dokterPenanggungJawab": "Dr. Maya Sari", "ruangan": "ICU", "status": "Aktif" },
  { "id": "9", "nama": "Christopher Miller", "nik": "9012345678901234", "diagnosaMasuk": "Tifus", "tanggalMasuk": "2024-01-16", "dokterPenanggungJawab": "Dr. Ahmad Susanto", "ruangan": "Ruang Mawar", "status": "Aktif" },
  { "id": "10", "nama": "Abebe Bikila", "nik": "0123456789012345", "diagnosaMasuk": "Cedera Kepala", "tanggalMasuk": "2024-01-17", "dokterPenanggungJawab": "Dr. Sari Indrawati", "ruangan": "ICU", "status": "Aktif" },
  { "id": "11", "nama": "Rajo Basa", "nik": "1122334455667788", "diagnosaMasuk": "Gagal Ginjal", "tanggalMasuk": "2024-01-18", "dokterPenanggungJawab": "Dr. Budi Santoso", "ruangan": "Ruang Anggrek", "status": "Aktif" },
  { "id": "12", "nama": "Sarah Wilson", "nik": "2233445566778899", "diagnosaMasuk": "Anemia", "tanggalMasuk": "2024-01-19", "dokterPenanggungJawab": "Dr. Maya Sari", "ruangan": "Ruang Melati", "status": "Aktif" },
  { "id": "13", "nama": "David Taylor", "nik": "3344556677889900", "diagnosaMasuk": "Patah Tulang", "tanggalMasuk": "2024-01-20", "dokterPenanggungJawab": "Dr. Ahmad Susanto", "ruangan": "VIP A", "status": "Aktif" },
  { "id": "14", "nama": "Amaechi Okoro", "nik": "4455667788990011", "diagnosaMasuk": "Vertigo", "tanggalMasuk": "2024-01-21", "dokterPenanggungJawab": "Dr. Sari Indrawati", "ruangan": "Ruang Mawar", "status": "Aktif" },
  { "id": "15", "nama": "Sutan Sjahrir", "nik": "5566778899001122", "diagnosaMasuk": "Bronkitis", "tanggalMasuk": "2024-01-22", "dokterPenanggungJawab": "Dr. Budi Santoso", "ruangan": "Ruang Anggrek", "status": "Aktif" },
  { "id": "16", "nama": "Jennifer Moore", "nik": "6677889900112233", "diagnosaMasuk": "Infeksi Saluran Kemih", "tanggalMasuk": "2024-01-23", "dokterPenanggungJawab": "Dr. Maya Sari", "ruangan": "Ruang Melati", "status": "Aktif" },
  { "id": "17", "nama": "Robert Anderson", "nik": "7788990011223344", "diagnosaMasuk": "Radang Sendi", "tanggalMasuk": "2024-01-24", "dokterPenanggungJawab": "Dr. Ahmad Susanto", "ruangan": "VIP A", "status": "Aktif" },
  { "id": "18", "nama": "Ngozi Eze", "nik": "8899001122334455", "diagnosaMasuk": "Kanker Payudara", "tanggalMasuk": "2024-01-25", "dokterPenanggungJawab": "Dr. Sari Indrawati", "ruangan": "ICU", "status": "Aktif" },
  { "id": "19", "nama": "Gadih Ranti", "nik": "9900112233445566", "diagnosaMasuk": "Stroke Ringan", "tanggalMasuk": "2024-01-26", "dokterPenanggungJawab": "Dr. Budi Santoso", "ruangan": "Ruang Mawar", "status": "Aktif" },
  { "id": "20", "nama": "James White", "nik": "0011223344556677", "diagnosaMasuk": "Gagal Jantung", "tanggalMasuk": "2024-01-27", "dokterPenanggungJawab": "Dr. Maya Sari", "ruangan": "Ruang Anggrek", "status": "Aktif" }
]

const sortOptions = [
  { value: "nama", label: "Nama" },
  { value: "tanggalMasuk", label: "Tanggal Masuk" },
];

const orderOptions = [
  { value: "asc", label: "A-Z / Terlama" },
  { value: "desc", label: "Z-A / Terbaru" },
];

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nama' | 'tanggalMasuk'>('nama');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Simulate API call with 500ms delay
  useEffect(() => {
    const fetchPatients = () => {
      setIsLoading(true);
      setTimeout(() => {
        setPatients(mockPatients);
        setIsLoading(false);
      }, 500);
    };

    fetchPatients();
  }, []);

  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    const filtered = patients.filter(patient => 
      patient.status === 'Aktif' &&
      (patient.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
       patient.nik.includes(searchTerm))
    );

    filtered.sort((a, b) => {
      let aValue: string = '';
      let bValue: string = '';
      
      if (sortBy === 'tanggalMasuk') {
        // Handle tanggal masuk sorting
        aValue = a.tanggalMasuk || '';
        bValue = b.tanggalMasuk || '';
        
        // Convert to timestamp for proper date comparison
        const aTime = new Date(aValue).getTime();
        const bTime = new Date(bValue).getTime();
        
        if (sortOrder === 'asc') {
          return aTime - bTime;
        } else {
          return bTime - aTime;
        }
      } else {
        // Handle nama sorting
        aValue = a[sortBy] || '';
        bValue = b[sortBy] || '';
        
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    });

    return filtered;
  }, [patients, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredAndSortedPatients.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Daftar Pasien Aktif</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola dan pantau pasien yang sedang dirawat inap
                </p>
              </div>
              <Link href="/">
                <Button>+ Tambah Pasien</Button>
              </Link>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Cari Pasien"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Cari berdasarkan nama atau NIK..."
                disabled={isLoading}
              />

              <Select
                label="Urutkan Berdasarkan"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'nama' | 'tanggalMasuk')}
                options={sortOptions}
                disabled={isLoading}
              />

              <Select
                label="Urutan"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                options={orderOptions}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Patient List */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Memuat data pasien...</span>
              </div>
            ) : paginatedPatients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NIK
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diagnosa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Masuk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dokter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ruangan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.nik}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.diagnosaMasuk}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(patient.tanggalMasuk)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.dokterPenanggungJawab}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.ruangan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {patient.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pasien</h3>
                <p className="mt-1 text-sm text-gray-500">Tidak ada pasien yang ditemukan dengan kriteria pencarian tersebut.</p>
                <div className="mt-6">
                  <Link href="/">
                    <Button>+ Tambah Pasien Pertama</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination - hanya tampil jika tidak loading dan ada data */}
            {!isLoading && totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-gray-700">
                    {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Show{' '}
                      <span className="font-medium">{startIndex + 1}</span>
                      {' '}-{' '}
                      <span className="font-medium">
                        {Math.min(startIndex + itemsPerPage, filteredAndSortedPatients.length)}
                      </span>
                      {' '}from{' '}
                      <span className="font-medium">{filteredAndSortedPatients.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px items-center">
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {/* Current Page Display */}
                      <div className="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </div>
                      
                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}