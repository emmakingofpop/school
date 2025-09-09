'use client';
import { useState, useEffect } from 'react';
import { Cours } from '../../../../services/CoursService';

type CoursFormProps = {
  cours: (Cours & { id: string }) | null;
  onSubmit: (data: Cours) => void;
  onCancel: () => void;
  profId: string;
  adminId: string;
};

const CoursForm = ({ cours, onSubmit, onCancel,profId,adminId }: CoursFormProps) => {
  const [formData, setFormData] = useState<Cours>({
    profId: '',
    Nomcour: '',
    ponderation: 0,
    isWithExam: false,
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, profId: profId }));
    if (cours) setFormData(cours);
  }, [cours]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ponderation: +formData.ponderation,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">
          {cours ? 'Modifier le cours' : 'Nouveau cours'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div hidden>
            <label className="block text-sm font-medium">Professeur *</label>
            <input
              name="profId"
              value={formData.profId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nom du cours *</label>
            <input
              name="Nomcour"
              value={formData.Nomcour}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pondération</label>
            <input
              type="number"
              name="ponderation"
              value={formData.ponderation}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isWithExam"
              name="isWithExam"
              checked={formData.isWithExam}
              onChange={handleChange}
            />
            <label htmlFor="isWithExam">Avec examen ?</label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {cours ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoursForm;
