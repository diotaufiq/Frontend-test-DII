"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

interface PatientFormData {
  nama: string;
  nik: string;
  diagnosaMasuk: string;
  tanggalMasuk: string;
  dokterPenanggungJawab: string;
  ruangan: string;
}

interface FormErrors {
  nama?: string;
  nik?: string;
  diagnosaMasuk?: string;
  tanggalMasuk?: string;
  dokterPenanggungJawab?: string;
  ruangan?: string;
}

const dokterOptions = [
  { value: "Dr. Ahmad Susanto", label: "Dr. Ahmad Susanto" },
  { value: "Dr. Sari Indrawati", label: "Dr. Sari Indrawati" },
  { value: "Dr. Budi Santoso", label: "Dr. Budi Santoso" },
  { value: "Dr. Maya Sari", label: "Dr. Maya Sari" },
];

const ruanganOptions = [
  { value: "Ruang Anggrek", label: "Ruang Anggrek" },
  { value: "Ruang Melati", label: "Ruang Melati" },
  { value: "Ruang Mawar", label: "Ruang Mawar" },
  { value: "ICU", label: "ICU" },
  { value: "VIP A", label: "VIP A" },
  { value: "VIP B", label: "VIP B" },
];

export default function PatientForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<PatientFormData>({
    nama: "",
    nik: "",
    diagnosaMasuk: "",
    tanggalMasuk: "",
    dokterPenanggungJawab: "",
    ruangan: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validasi nama
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama pasien wajib diisi";
    } else if (formData.nama.trim().length < 2) {
      newErrors.nama = "Nama pasien minimal 2 karakter";
    }

    // Validasi NIK
    if (!formData.nik.trim()) {
      newErrors.nik = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus terdiri dari 16 digit angka";
    }

    // Validasi diagnosa
    if (!formData.diagnosaMasuk.trim()) {
      newErrors.diagnosaMasuk = "Diagnosa masuk wajib diisi";
    } else if (formData.diagnosaMasuk.trim().length < 3) {
      newErrors.diagnosaMasuk = "Diagnosa masuk minimal 3 karakter";
    }

    // Validasi tanggal masuk
    if (!formData.tanggalMasuk) {
      newErrors.tanggalMasuk = "Tanggal masuk wajib diisi";
    } else {
      const selectedDate = new Date(formData.tanggalMasuk);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.tanggalMasuk = "Tanggal masuk tidak boleh kurang dari hari ini";
      }
    }

    // Validasi dokter
    if (!formData.dokterPenanggungJawab) {
      newErrors.dokterPenanggungJawab = "Dokter penanggung jawab wajib dipilih";
    }

    // Validasi ruangan
    if (!formData.ruangan) {
      newErrors.ruangan = "Ruangan wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Khusus untuk NIK, hanya izinkan angka
    if (name === 'nik') {
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error ketika user mulai mengetik
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Mohon lengkapi semua field yang diperlukan', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form submitted:", formData);
      
      // Ganti alert dengan toast
      showToast('✅ Pasien berhasil didaftarkan!', 'success');
      
      // Reset form
      setFormData({
        nama: "",
        nik: "",
        diagnosaMasuk: "",
        tanggalMasuk: "",
        dokterPenanggungJawab: "",
        ruangan: ""
      });
      setErrors({});
      
      // Redirect setelah delay
      setTimeout(() => {
        router.push("/list");
      }, 1500);
      
    } catch (error) {
      showToast('❌ Gagal mendaftarkan pasien. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast function
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Close toast function
  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
        duration={5000}
      />

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Formulir Pasien</h1>
              <p className="mt-1 text-sm text-gray-600">
                Silakan lengkapi informasi pasien
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Grid Layout - 2 kolom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom Kiri */}
                <div className="space-y-6">
                  <Input
                    id="nama"
                    name="nama"
                    label="Nama Pasien"
                    required
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap pasien"
                    error={errors.nama}
                  />

                  <Input
                    id="nik"
                    name="nik"
                    label="NIK"
                    required
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIK 16 digit"
                    maxLength={16}
                    error={errors.nik}
                  />

                  <Input
                    id="diagnosaMasuk"
                    name="diagnosaMasuk"
                    label="Diagnosa Masuk"
                    required
                    value={formData.diagnosaMasuk}
                    onChange={handleInputChange}
                    placeholder="Masukkan diagnosa awal"
                    error={errors.diagnosaMasuk}
                  />
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-6">
                  <Input
                    id="tanggalMasuk"
                    name="tanggalMasuk"
                    type="date"
                    label="Tanggal Masuk"
                    required
                    value={formData.tanggalMasuk}
                    onChange={handleInputChange}
                    error={errors.tanggalMasuk}
                    min={new Date().toISOString().split('T')[0]}
                  />

                  <Select
                    id="dokterPenanggungJawab"
                    name="dokterPenanggungJawab"
                    label="Dokter Penanggung Jawab"
                    required
                    value={formData.dokterPenanggungJawab}
                    onChange={handleInputChange}
                    options={dokterOptions}
                    error={errors.dokterPenanggungJawab}
                  />

                  <Select
                    id="ruangan"
                    name="ruangan"
                    label="Ruangan"
                    required
                    value={formData.ruangan}
                    onChange={handleInputChange}
                    options={ruanganOptions}
                    error={errors.ruangan}
                  />
                </div>
              </div>

              {/* Tombol Submit - Full Width */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Menyimpan...' : 'Daftarkan Pasien'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}