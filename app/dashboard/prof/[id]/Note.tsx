'use client';
import { useState, useEffect } from 'react';
import { Note, NoteService } from '../../../services/NoteService';
import NoteForm from './components/NoteForm';
import { obtenirEtudiant } from '../../../services/studentsServices';
import { CoursService } from '../../../services/CoursService';

interface NoteProps {
  profId: string;
  adminId: string;
}

type NoteWithId = Note & { id: string; studentName?: string; courName?: string };

const Notes = ({ profId, adminId }: NoteProps) => {
  const [notes, setNotes] = useState<NoteWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<NoteWithId | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadNotes(profId);
  }, [profId]);

  const loadNotes = async (profId: string) => {
    setLoading(true);
    const all = await NoteService.getNoteByProfId(profId);

    // hydrate notes with student + cour names
    const enriched = await Promise.all(
      all.map(async (n: NoteWithId) => {
        const student = await obtenirEtudiant(n.studentId);
        const cour = await CoursService.getById(n.courId);
        return {
          ...n,
          studentName: student?.nomComplet || '',
          courName: cour?.Nomcour || '',
        };
      })
    );

    setNotes(enriched);
    setLoading(false);
  };

  const isDuplicate = (note: Note, excludeId?: string) =>
    notes.some(
      (n) =>
        n.studentId === note.studentId &&
        n.courId === note.courId &&
        n.periode === note.periode &&
        (!excludeId || n.id !== excludeId)
    );

  const handleSubmit = async (data: Note): Promise<any | null> => {
    let datas: any | null = null;
    if (editingNote) {
      datas = await NoteService.update(editingNote.id, data);
    } else {
      datas = await NoteService.add(data);
    }
    setEditingNote(null);
    loadNotes(profId);
    return datas;
  };

  const handleDelete = async (id: string) => {
    await NoteService.delete(id);
    loadNotes(profId);
  };

  // Filter notes by student name
  const filteredNotes = notes.filter((n) =>
    n.studentName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-white">Gestion des Cotes</h1>
        <button
          onClick={() => {
            setEditingNote(null);
            setShowForm(true);
          }}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
        >
          +
        </button>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom d'élève..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-amber-50 rounded-lg shadow text-white "
        />
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-white">Chargement...</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-center text-gray-500">Aucune note trouvée</p>
      ) : (
        <div className="space-y-4 h-[70vh] overflow-y-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow p-4 border flex flex-col"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">
                  Élève: {note.studentName}
                </h2>
                <span className="text-sm text-gray-500">{note.courName}</span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="font-medium">Cote:</span> {note.cote}
                </p>
                <p>
                  <span className="font-medium">Exam:</span>{' '}
                  {note.isWithExam ? '✔ Oui' : '✘ Non'}
                </p>
                <p>
                  <span className="font-medium">Période:</span> {note.periode}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setEditingNote(note);
                    setShowForm(true);
                  }}
                  className="px-3 py-1 text-sm rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                >
                  ✏ Modifier
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
                >
                  🗑 Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup form */}
      {showForm && (
        <NoteForm
          profId={profId}
          adminId={adminId}
          note={editingNote}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isDuplicate={(n) => isDuplicate(n, editingNote?.id)}
        />
      )}
    </div>
  );
};

export default Notes;
