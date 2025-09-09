'use client'
import React, { Dispatch, SetStateAction, use } from 'react'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ClasseService, Classe } from '../services/ClasseService';
import ClassForm from './components/ClassForm';
import ConfirmationModal from './components/ConfirmationModal';

type Props = {
    setClassess: Dispatch<SetStateAction<boolean>>;
    adminId: string;
}

// Define a type for Class with id
type ClasseWithId = Classe & { id: string };

function Classes({ setClassess,adminId }: Props) {
    const [classes, setClasses] = useState<ClasseWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClass, setEditingClass] = useState<ClasseWithId | null>(null);
    const [classToDelete, setClassToDelete] = useState<ClasseWithId | null>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Replace with actual admin ID (from authentication context)
    
    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            setLoading(true);
            const classesData = await ClasseService.getAllByAdmin(adminId);
            setClasses(classesData);
            console.log(classesData)
        } catch (error) {
            showNotification('Erreur lors du chargement des classes', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Check for duplicate classes
    const isDuplicateClass = (classData: Classe, excludeId?: string): boolean => {
        return classes.some(classe => 
            classe.nom.toLowerCase().trim() === classData.nom.toLowerCase().trim() &&
            classe.niveau.toLowerCase().trim() === classData.niveau.toLowerCase().trim() &&
            (!excludeId || classe.id !== excludeId)
        );
    };

    const handleAddClass = () => {
        setEditingClass(null);
        setShowForm(true);
    };

    const handleEditClass = (classe: ClasseWithId) => {
        setEditingClass(classe);
        setShowForm(true);
    };

    const handleDeleteClass = (classe: ClasseWithId) => {
        setClassToDelete(classe);
    };

    const confirmDelete = async () => {
        if (!classToDelete) return;

        try {
            const success = await ClasseService.delete(classToDelete.id);
            if (success) {
                showNotification('Classe supprimée avec succès', 'success');
                loadClasses();
            } else {
                showNotification('Erreur lors de la suppression', 'error');
            }
        } catch (error) {
            showNotification('Erreur lors de la suppression', 'error');
        } finally {
            setClassToDelete(null);
        }
    };

    const handleFormSubmit = async (classData: Classe) => {
        try {
            // Check for duplicates before submitting
            if (isDuplicateClass(classData, editingClass?.id)) {
                showNotification('Une classe avec le même nom, niveau, année scolaire et école existe déjà', 'error');
                return;
            }

            let success = false;
            
            if (editingClass) {
                // Update existing class
                success = await ClasseService.update(editingClass.id, classData);
                if (success) {
                    showNotification('Classe mise à jour avec succès', 'success');
                }
            } else {
                // Add new class
                const id = await ClasseService.add({ ...classData, id_admin: adminId });
                success = !!id;
                if (success) {
                    showNotification('Classe ajoutée avec succès', 'success');
                }
            }
            
            if (success) {
                setShowForm(false);
                loadClasses();
            } else {
                showNotification("Erreur lors de l'opération", 'error');
            }
        } catch (error) {
            showNotification("Erreur lors de l'opération", 'error');
        }
    };

    const showNotification = (message: string, type: string) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen  p-4">
            <Head>
                <title>Gestion des Classes</title>
                <meta name="description" content="Application de gestion des classes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Classes</h1>
                    <button
                        onClick={handleAddClass}
                        className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                        aria-label="Ajouter une classe"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div>
                        {classes.length === 0 ? (
                            <div className="text-center py-8 bg-white rounded-lg shadow">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 mb-4">Aucune classe enregistrée</p>
                                <button
                                    onClick={handleAddClass}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Ajouter votre première classe
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4 h-[70dvh] overflow-y-scroll">
                                {classes.map((classe) => (
                                    <div key={classe.id} className="bg-white rounded-lg shadow p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-gray-800">{classe.nom}</h3>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditClass(classe)}
                                                    className="text-blue-500 hover:text-blue-700 p-1"
                                                    aria-label="Modifier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClass(classe)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    aria-label="Supprimer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{classe.niveau}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{classe.anneeScolaire}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Class Form Modal */}
            {showForm && (
                <ClassForm
                    classe={editingClass}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                    isDuplicate={(classData) => isDuplicateClass(classData, editingClass?.id)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {classToDelete && (
                <ConfirmationModal
                    title="Confirmer la suppression"
                    message={`Êtes-vous sûr de vouloir supprimer la classe "${classToDelete.nom}" ?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setClassToDelete(null)}
                />
            )}

            {/* Notification */}
            {notification.show && (
                <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                    {notification.message}
                </div>
            )}
        </div>
    )
}

export default Classes;