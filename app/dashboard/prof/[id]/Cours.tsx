'use client';
import { useState, useEffect } from 'react';
import { Cours, CoursService } from '../../../services/CoursService';
import {getProfById} from '../../../services/profService';
import CoursForm from './components/CoursForm';
import { Classe,ClasseService } from '@/app/services/ClasseService';

interface Props {
  profId: string;
  adminId: string;
}


type CoursWithId = Cours & { id: string };

const CoursPage = ({profId,adminId}:Props) => {
  const [allClasses, setAllClasses] = useState<(Classe & { id: string })[]>([]);
  const [cours, setCours] = useState<CoursWithId[]>([]);
  const [prof, setProf] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCours, setEditingCours] = useState<CoursWithId | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCours();
    loadClasses();
  }, []);

  const loadCours = async () => {
    setLoading(true);
    const all = await CoursService.getAll();
    const profData = await getProfById(profId);
    setProf(profData);
    setCours(all);
    setLoading(false);
  };

    const loadClasses = async () => {
      const data = await ClasseService.getAllByAdmin(adminId);
      setAllClasses(data);
    };
  

  const handleSubmit = async (data: Cours) => {
    if (editingCours) {
      await CoursService.update(editingCours.id, data);
    } else {
      await CoursService.add(data);
    }
    setShowForm(false);
    setEditingCours(null);
    loadCours();
  };

  const handleDelete = async (id: string) => {
    await CoursService.delete(id);
    loadCours();
  };

  return (
    <div className="p-4 text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">Gestion des Cours</h1>
        <button
          onClick={() => {
            setEditingCours(null);
            setShowForm(true);
          }}
          className="p-2 w-10 h-10  bg-blue-600 text-white rounded-full"
        >
          +
        </button>
      </div>

      {loading ? (
        <p className='text-white'>Chargement...</p>
      ) : cours.length === 0 ? (
        <p className='text-white'>Aucun cours enregistré</p>
      ) : (
        <>
          {/* Table pour les grands écrans */}
          <div className="hidden md:block bg-gray-100">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Prof</th>
                  <th className="p-2">Nom du cours</th>
                  <th className="p-2">Pondération</th>
                  <th className="p-2">Examen ?</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cours.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{prof?.teacher?.fullName || ''}</td>
                    <td className="p-2">{c.Nomcour}

                      {c.classId && <ul className="list-disc ml-5">
                        {c.classId.map(cid => {
                          const classe = allClasses.find(c => c.id === cid);
                          return classe ? <li key={cid}>{classe.niveau+' '+classe.nom}</li> : null;
                        })}
                      </ul>}
                    </td>
                    <td className="p-2">{c.ponderation}</td>
                    <td className="p-2">{c.isWithExam ? '✔' : '✘'}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => {
                          setEditingCours(c);
                          setShowForm(true);
                        }}
                        className="text-blue-600"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartes pour les mobiles */}
          <div className="space-y-3 md:hidden h-[70vh] overflow-y-auto">
            {cours.map((c) => (
              <div
                key={c.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Cour : {c.Nomcour}</h3>
                  <span className="text-sm text-gray-500">
                    Pond: {c.ponderation}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Prof: </span>
                  {prof?.teacher?.fullName || ''}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Examen: </span>
                  {c.isWithExam ? '✔ Oui' : '✘ Non'}
                </p>
                {c.classId && <ul className="list-disc ml-5">
                  {c.classId.map(cid => {
                    const classe = allClasses.find(c => c.id === cid);
                    return classe ? <li key={cid}>{classe.niveau+' '+classe.nom}</li> : null;
                  })}
                </ul>}
                <div className="flex justify-end space-x-4 mt-3">
                  <button
                    onClick={() => {
                      setEditingCours(c);
                      setShowForm(true);
                    }}
                    className="text-blue-600"
                  >
                    ✏ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600"
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <CoursForm
          profId={profId}
          adminId={adminId}
          cours={editingCours}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CoursPage;
