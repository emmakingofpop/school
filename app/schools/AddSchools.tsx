'use client';

import { useState } from 'react';
import { SchoolService, School } from '../services/schoolService';

export default function SchoolForm() {
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    principal: '',
    url_logo: '',
    academicYear: ['2025-2026']
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Add school
      const id = await SchoolService.add(formData as School);


      setMessage('✅ School added successfully!');
      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        principal: '',
        url_logo: '',
        academicYear: ['2025-2026']
      });
      setLogoFile(null);
    } catch (error) {
      console.error(error);
      setMessage('❌ Error adding school.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-white space-y-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#FF7E29]">Add New School</h2>

      <input
        type="text"
        name="name"
        placeholder="School Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="text"
        name="principal"
        placeholder="Principal Name"
        value={formData.principal}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />


      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#FF7E29] text-black font-bold py-2 rounded-lg hover:bg-[#ff954d] transition"
      >
        {isSubmitting ? 'Saving...' : 'Save School'}
      </button>

      {message && (
        <p className="text-center mt-4 text-sm">{message}</p>
      )}
    </form>
  );
}
