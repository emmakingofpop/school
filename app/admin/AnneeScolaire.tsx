'use client'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Head from 'next/head';
import { AnneeScolaireService, AnneeScolaire } from '../services/AnneeScolaireService';
import AnneeForm from './components/AnneeForm';
import ConfirmationModal from './components/ConfirmationModal';

type Props = {
    setAnneeScolaire: Dispatch<SetStateAction<boolean>>;
    adminId: string;
}

// Define type with id
type AnneeWithId = AnneeScolaire & { id: string };

function AnneeScolaires({ setAnneeScolaire,adminId }: Props) {
    const [annees, setAnnees] = useState<AnneeWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAnnee, setEditingAnnee] = useState<AnneeWithId | null>(null);
    const [anneeToDelete, setAnneeToDelete] = useState<AnneeWithId | null>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        loadAnnees();
    }, []);

    const loadAnnees = async () => {
        try {
            setLoading(true);
            const data = await AnneeScolaireService.getAll();
            setAnnees(data);
        } catch (error) {
            showNotification('Erreur lors du chargement des années scolaires', 'error');
        } finally {
            setLoading(false);
        }
    };

    const isDuplicateAnnee = (anneeData: AnneeScolaire, excludeId?: string) => {
        return annees.some(a => 
            a.annee === anneeData.annee && (!excludeId || a.id !== excludeId)
        );
    };

    const handleAddAnnee = () => {
        setEditingAnnee(null);
        setShowForm(true);
    };

    const handleEditAnnee = (annee: AnneeWithId) => {
        setEditingAnnee(annee);
        setShowForm(true);
    };

    const handleDeleteAnnee = (annee: AnneeWithId) => {
        setAnneeToDelete(annee);
    };

    const confirmDelete = async () => {
        if (!anneeToDelete) return;

        try {
            const success = await AnneeScolaireService.delete(anneeToDelete.id);
            if (success) {
                showNotification('Année scolaire supprimée avec succès', 'success');
                loadAnnees();
            } else {
                showNotification('Erreur lors de la suppression', 'error');
            }
        } catch (error) {
            showNotification('Erreur lors de la suppression', 'error');
        } finally {
            setAnneeToDelete(null);
        }
    };

    const handleFormSubmit = async (anneeData: AnneeScolaire) => {
        try {
            if (isDuplicateAnnee(anneeData, editingAnnee?.id)) {
                showNotification('Cette année scolaire existe déjà', 'error');
                return;
            }

            let success = false;
            if (editingAnnee) {
                success = await AnneeScolaireService.update(editingAnnee.id, anneeData);
                if (success) showNotification('Année scolaire mise à jour', 'success');
            } else {
                const id = await AnneeScolaireService.add(anneeData);
                success = !!id;
                if (success) showNotification('Année scolaire ajoutée', 'success');
            }

            if (success) {
                setShowForm(false);
                loadAnnees();
                setAnneeScolaire(prev => !prev);
            } else {
                showNotification("Erreur lors de l'opération", 'error');
            }
        } catch (error) {
            showNotification("Erreur lors de l'opération", 'error');
        }
    };

    const showNotification = (message: string, type: string) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    return (
        <div className="min-h-screen p-4">
            <Head>
                <title>Gestion des Années Scolaires</title>
            </Head>

            <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Années Scolaires</h1>
                    <button
                        onClick={handleAddAnnee}
                        className="bg-blue-500 text-white p-2 rounded-full w-10 h-10 hover:bg-blue-600"
                    >
                        +
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div>
                        {annees.length === 0 ? (
                            <div className="text-center py-8 bg-white rounded-lg shadow">
                                <p className="text-gray-500 mb-4">Aucune année scolaire enregistrée</p>
                                <button
                                    onClick={handleAddAnnee}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
                                >
                                    Ajouter la première année
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {annees.map(a => (
                                    <div key={a.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                                        <span className="text-gray-800">{a.annee}</span>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditAnnee(a)} className="text-blue-500">✏️</button>
                                            <button onClick={() => handleDeleteAnnee(a)} className="text-red-500">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showForm && (
                <AnneeForm
                    adminId = {adminId}
                    annee={editingAnnee}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {anneeToDelete && (
                <ConfirmationModal
                    title="Confirmer la suppression"
                    message={`Êtes-vous sûr de vouloir supprimer l'année "${anneeToDelete.annee}" ?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setAnneeToDelete(null)}
                />
            )}

            {notification.show && (
                <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}

export default AnneeScolaires;
