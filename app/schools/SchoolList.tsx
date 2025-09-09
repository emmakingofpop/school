'use client';

import { useEffect, useState } from 'react';
import { SchoolService, School } from '../services/schoolService';
import SchoolEdit from './SchoolEdit';

type SchoolWithId = School & { id: string };

export default function SchoolList() {
  const [schools, setSchools] = useState<SchoolWithId[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const loadSchools = async () => {
    const id_admin = localStorage.getItem('masomo_admin') || ''
    const schoolsWithId = (await SchoolService.getAllDocs(id_admin)) as SchoolWithId[];
    setSchools(schoolsWithId);
  };

  useEffect(() => {
    loadSchools();
  }, [selectedSchoolId]);

  if (selectedSchoolId) {
    return (
      <div className=" p-2 flex items-center justify-center">
        <SchoolEdit schoolId={selectedSchoolId} setSelectedSchoolId={setSelectedSchoolId}  />
      </div>
    );
  }

  return (
    <div className=" text-white p-8">
      <h1 className="text-3xl font-bold text-[#FF7E29] mb-6">All Schools</h1>

      {schools.length === 0 && <p>No schools found.</p>}

      <div className="overflow-scroll h-[55dvh] grid grid-cols-1 md:grid-cols-2 gap-6">
        {schools.reverse().map((school) => (
          <div key={school.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg space-y-2">
            <h2 className="text-xl font-bold text-[#FF7E29]">{school.name}</h2>
            <p className="text-gray-300">{school.address}</p>
            <p className="text-gray-300">{school.email}</p>
            <p className="text-gray-300">Principal: {school.principal}</p>
            {school.url_logo && (
              <img src={school.url_logo} alt="School logo" className="w-32 h-auto mt-2 rounded" />
            )}
            <button
              onClick={() => setSelectedSchoolId(school.id)}
              className="mt-4 w-full bg-[#FF7E29] text-black font-bold py-2 rounded-lg hover:bg-[#ff954d] transition"
            >
              Edit School
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
