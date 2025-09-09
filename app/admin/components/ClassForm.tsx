'use client';
import { useState, useEffect } from 'react';
import { Classe } from '../../services/ClasseService';

type ClassFormProps = {
    classe: (Classe & { id: string }) | null;
    onSubmit: (data: Classe) => void;
    onCancel: () => void;
    isDuplicate: (classData: Classe) => boolean;
};

const ClassForm = ({ classe, onSubmit, onCancel, isDuplicate }: ClassFormProps) => {
    const rdcClasses = [
  // Maternelle
  { value: "M1", label: "1ʳᵉ Maternelle" },
  { value: "M2", label: "2ᵉ Maternelle" },
  { value: "M3", label: "3ᵉ Maternelle" },

  // Primaire
  { value: "1P", label: "1ʳᵉ Primaire" },
  { value: "2P", label: "2ᵉ Primaire" },
  { value: "3P", label: "3ᵉ Primaire" },
  { value: "4P", label: "4ᵉ Primaire" },
  { value: "5P", label: "5ᵉ Primaire" },
  { value: "6P", label: "6ᵉ Primaire" },

  // Secondaire – Premier cycle
  { value: "7e", label: "7ᵉ (1ʳᵉ Secondaire)" },
  { value: "8e", label: "8ᵉ (2ᵉ Secondaire)" },
  { value: "9e", label: "9ᵉ (3ᵉ Secondaire)" },
  { value: "10e", label: "10ᵉ (4ᵉ Secondaire)" },

  // Humanités (cycle terminal)
  { value: "11e", label: "11ᵉ (5ᵉ Humanités)" },
  { value: "12e", label: "12ᵉ (6ᵉ Humanités)" },
  { value: "13e", label: "13ᵉ (7ᵉ Humanités)" },
  { value: "14e", label: "14ᵉ (8ᵉ Humanités - TS)" }
];

    const [formData, setFormData] = useState<Classe>({
        nom: 'vide',
        niveau: '',
        anneeScolaire: '2024-2025',
        id_ecole: 'All',
        id_admin: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [isvalidation, setIsvalidation] = useState(false);

    useEffect(() => {
        if (classe) {
            setFormData({
                nom: classe.nom || '',
                niveau: classe.niveau || '',
                anneeScolaire: classe.anneeScolaire || '',
                id_ecole: classe.id_ecole || 'All',
                id_admin: classe.id_admin || ''
            });
        }
    }, [classe]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom de la classe est requis';
        }
        
        if (!formData.niveau) {
            newErrors.niveau = 'Le niveau est requis';
        }
        
        if (!formData.anneeScolaire.trim()) {
            newErrors.anneeScolaire = "L'année scolaire est requise";
        } else if (!/^\d{4}-\d{4}$/.test(formData.anneeScolaire)) {
            newErrors.anneeScolaire = "Le format doit être AAAA-AAAA (ex: 2024-2025)";
        }
        
        if (!formData.id_ecole.trim()) {
            newErrors.id_ecole = "L'ID de l'école est requis";
        }
        
        if (isDirty && isDuplicate(formData)) {
            newErrors.duplicate = 'Une classe avec ces informations existe déjà';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isDirty) {
            setIsvalidation(false)
            validateForm();
        }
    }, [formData, isDirty]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setIsDirty(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDirty(true);
        
        if (validateForm()) {
            setIsvalidation(true)
            onSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {classe ? 'Modifier la classe' : 'Ajouter une classe'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-4 text-black">
                    {errors.duplicate && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {errors.duplicate}
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de la classe *
                        </label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.nom ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 mb-1">
                            Niveau scolaire *
                        </label>
                        <select
                            id="niveau"
                            name="niveau"
                            value={formData.niveau}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.niveau ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Sélectionner un niveau</option>
                            {rdcClasses.map((cls) => (
                                <option key={cls.value} value={cls.label}>
                                    {cls.label}
                                </option>
                            ))}
                        </select>
                        {errors.niveau && <p className="mt-1 text-sm text-red-600">{errors.niveau}</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="anneeScolaire" className="block text-sm font-medium text-gray-700 mb-1">
                            Année scolaire *
                        </label>
                        <input
                            type="text"
                            id="anneeScolaire"
                            name="anneeScolaire"
                            value={formData.anneeScolaire}
                            onChange={handleChange}
                            placeholder="Ex: 2024-2025"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.anneeScolaire ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.anneeScolaire && <p className="mt-1 text-sm text-red-600">{errors.anneeScolaire}</p>}
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="id_ecole" className="block text-sm font-medium text-gray-700 mb-1">
                            ID de l'école *
                        </label>
                        <input
                            type="text"
                            id="id_ecole"
                            name="id_ecole"
                            value={formData.id_ecole}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.id_ecole ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.id_ecole && <p className="mt-1 text-sm text-red-600">{errors.id_ecole}</p>}
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white py-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={Object.keys(errors).length > 0 || isvalidation === true}
                        >
                            {classe ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassForm;