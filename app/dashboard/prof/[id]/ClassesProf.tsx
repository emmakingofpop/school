'use client';
import { useState, useEffect } from 'react';
import { Classe,ClasseService } from '../../../services/ClasseService';
import {getProfById} from '../../../services/profService';
import { ClassesProf, ClassesProfService } from '../../../services/ClassesProfService';
import ClassesProfForm from './components/ClassesProfForm';

interface Props {
  profId: string;
  adminId: string;
}

type ClassesProfWithId = ClassesProf & { id: string };

const ClassesProfPage = ({ profId, adminId }: Props) => {
  const [assignations, setAssignations] = useState<ClassesProfWithId[]>([]);
  const [prof, setProf] = useState<any | null>(null);
  const [allClasses, setAllClasses] = useState<(Classe & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAssignation, setEditingAssignation] = useState<ClassesProfWithId | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAssignations();
    loadClasses();
  }, []);

  const loadAssignations = async () => {
    setLoading(true);
    const all = await ClassesProfService.getByProfId(profId);
    const profData = await getProfById(profId);
    setProf(profData);
    setAssignations(all ? [all] : []);
    setLoading(false);
    
  };

  const loadClasses = async () => {
    const data = await ClasseService.getAllByAdmin(adminId);
    setAllClasses(data);
  };

  const handleSubmit = async (data: ClassesProf) => {
    let datas : any | null = null;
    if (editingAssignation) {
      datas = await ClassesProfService.update(editingAssignation.id, data);
    } else {
      datas = await ClassesProfService.add(data);
    }
    setShowForm(false);
    setEditingAssignation(null);
    loadAssignations();
    return datas;
  };

  const handleDelete = async (id: string) => {
    await ClassesProfService.delete(id);
    loadAssignations();
  };

  return (
    <div className="p-4 text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">Assignations Prof – Classes</h1>
        <button
          onClick={() => {
            setEditingAssignation(null);
            setShowForm(true);
          }}
          className="p-2 w-10 h-10 rounded-full bg-blue-600 text-white"
        >
         +
        </button>
      </div>

      {loading ? (
        <p className='text-white'>Chargement...</p>
      ) : assignations.length === 0 ? (
        <p className='text-white'>Aucune assignation trouvée</p>
      ) : (
        <>
          {/* Table pour desktop */}
          <div className="hidden md:block h-[70vh] overflow-y-auto">
            <table className="w-full border bg-gray-100 text-sm text-left  ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Prof</th>
                  <th className="p-2">Classes</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignations.map(a => (
                  <tr key={a.id} className="border-t">
                    <td className="p-2">{prof?.teacher?.fullName || ''}</td>
                    <td className="p-2">
                      <ul className="list-disc ml-5">
                        {a.classeId.map(cid => {
                          const classe = allClasses.find(c => c.id === cid);
                          return classe ? <li key={cid}>{classe.niveau+' '+classe.nom}</li> : null;
                        })}
                      </ul>
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => {
                          setEditingAssignation(a);
                          setShowForm(true);
                        }}
                        className="text-blue-600"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
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

          {/* Cartes pour mobile */}
          <div className="space-y-3 md:hidden h-[70vh] overflow-y-auto">
            {assignations.map(a => (
              <div
                key={a.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Prof: {prof?.teacher?.fullName || ''}</h3>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Classes: </span>
                  <ul className="list-disc ml-5">
                    {a.classeId.map(cid => {
                      const classe = allClasses.find(c => c.id === cid);
                      return classe ? <li key={cid}>{classe.niveau+' '+classe.nom}</li> : null;
                    })}
                  </ul>
                </div>
                <div className="flex justify-end space-x-4 mt-3">
                  <button
                    onClick={() => {
                      setEditingAssignation(a);
                      setShowForm(true);
                    }}
                    className="text-blue-600"
                  >
                    ✏ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
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
        <ClassesProfForm
          profId={profId} 
          adminId={adminId}
          data={editingAssignation}
          allClasses={allClasses}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingAssignation(null); }}
        />
      )}
    </div>
  );
};

export default ClassesProfPage;
