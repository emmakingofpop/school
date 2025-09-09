'use client';
import { useState, useEffect } from 'react';
import { AnneeScolaire } from '../../services/AnneeScolaireService';

type AnneeFormProps = {
    adminId:string;
    annee: (AnneeScolaire & { id: string }) | null;
    onSubmit: (data: AnneeScolaire) => void;
    onCancel: () => void;
};

const AnneeForm = ({ adminId,annee, onSubmit, onCancel }: AnneeFormProps) => {
    const [formData, setFormData] = useState<AnneeScolaire>({
        annee: '2024-2025',
        id_admin: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (annee) {
            setFormData({
                annee: annee.annee || '2024-2025',
                id_admin: annee.id_admin || '',
            });
        }
    }, [annee]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.annee.trim()) {
            newErrors.annee = "L'année scolaire est requise";
        } else if (!/^\d{4}-\d{4}$/.test(formData.annee)) {
            newErrors.annee = "Le format doit être AAAA-AAAA (ex: 2024-2025)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isDirty) {
            setIsValid(validateForm());
        }
    }, [formData, isDirty]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ annee: e.target.value ,id_admin:adminId });
        setIsDirty(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDirty(true);

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {annee ? 'Modifier l\'année scolaire' : 'Ajouter une année scolaire'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-4 text-black">
                    <div className="mb-4">
                        <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">
                            Année scolaire *
                        </label>
                        <input
                            type="text"
                            id="annee"
                            name="annee"
                            value={formData.annee}
                            onChange={handleChange}
                            placeholder="Ex: 2024-2025"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.annee ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.annee && <p className="mt-1 text-sm text-red-600">{errors.annee}</p>}
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
                            disabled={!isValid}
                        >
                            {annee ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnneeForm;
