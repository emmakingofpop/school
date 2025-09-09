'use client';
import { useState, useEffect } from 'react';
import { Classe } from '../../../../services/ClasseService';
import { ClassesProf } from '../../../../services/ClassesProfService';

type Props = {
  data: ClassesProf | null;
  allClasses: (Classe & { id: string })[];
  onSubmit: (data: ClassesProf) => any;
  onCancel: () => void;
  profId: string;
  adminId: string;
};

const ClassesProfForm = ({ data, allClasses, onSubmit, onCancel,profId, adminId  }: Props) => {
  const [formData, setFormData] = useState<ClassesProf>({
    profId: '',
    classeId: [],
  });

  useEffect(() => {
    if (profId) setFormData(prev => ({ ...prev, profId: profId }))
  }, [profId]);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, classeId: selected }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profId) return alert('Le professeur est obligatoire.');
    if (formData.classeId.length === 0) return alert('Au moins une classe doit être sélectionnée.');
     onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">{data ? 'Modifier assignation' : 'Nouvelle assignation'}</h2>

          <div hidden>
            <label className="block text-sm mb-1">Professeur *</label>
            <input
              type="text"
              name="profId"
              value={formData.profId}
              onChange={e => setFormData(prev => ({ ...prev, profId: e.target.value }))}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Classes *</label>
            <select
              multiple
              value={formData.classeId}
              onChange={handleChange}
              className="w-full border p-2 rounded h-40"
            >
              {allClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.niveau +' '+ cls.nom}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-3 py-2 bg-gray-200 rounded">Annuler</button>
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">{data ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassesProfForm;
