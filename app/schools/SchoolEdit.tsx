'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SchoolService, School } from '../services/schoolService';

type Props = {
  schoolId: string;
  setSelectedSchoolId: Dispatch<SetStateAction<string | null>>;
};

export default function SchoolEdit({ schoolId,setSelectedSchoolId }: Props) {
  const [school, setSchool] = useState<Partial<School> | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSchool = async () => {
      const data = await SchoolService.getById(schoolId);
      if (data) {
        setSchool(data);
      }
    };
    loadSchool();
  }, [schoolId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchool((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    setIsSaving(true);
    setMessage(null);

    try {
     await SchoolService.update(schoolId,school)
     setSelectedSchoolId(null)
      setMessage('✅ School updated!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Error updating school.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this school?')) return;
    setIsDeleting(true);
    setMessage(null);

    try {
      await SchoolService.delete(schoolId);
      setSelectedSchoolId(null)
      setMessage('✅ School deleted!');
      setSchool(null);
    } catch (error) {
      console.error(error);
      setMessage('❌ Error deleting school.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!school) return <p className="text-white text-center">Loading school data...</p>;

  return (
    <form onSubmit={handleUpdate} className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 text-white space-y-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#FF7E29]">Edit School</h2>

      <input
        type="text"
        name="name"
        placeholder="School Name"
        value={school.name}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={school.address}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={school.phone}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={school.email}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />

      <input
        type="text"
        name="principal"
        placeholder="Principal Name"
        value={school.principal}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-lg bg-black border border-gray-500 placeholder-gray-400 focus:ring focus:ring-[#FF7E29]"
      />


      <button
        type="submit"
        disabled={isSaving}
        onClick={handleUpdate}
        className="w-full bg-[#FF7E29] text-black font-bold py-2 rounded-lg hover:bg-[#ff954d] transition"
      >
        {isSaving ? 'Saving...' : 'Update School'}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition"
      >
        {isDeleting ? 'Deleting...' : 'Delete School'}
      </button>

      {message && <p className="text-center mt-4 text-sm">{message}</p>}
    </form>
  );
}
