'use client';
import { useState, useEffect } from 'react';
import { Note } from '../../../../services/NoteService';
import {getProfById, Teacher} from '../../../../services/profService';
import {School, SchoolService} from '../../../../services/schoolService';
import { Classe,ClasseService } from '../../../../services/ClasseService';
import { ClassesProf, ClassesProfService } from '../../../../services/ClassesProfService';
import {AnneeScolaireService} from '../../../../services/AnneeScolaireService';
import {CoursService} from '../../../../services/CoursService';
import {InscriptionService} from '../../../../services/InscriptionService';
import {obtenirEtudiant} from '../../../../services/studentsServices';

type NoteFormProps = {
  note: (Note & { id: string }) | null;
  onSubmit: (data: Note) => Promise<any|null>;
  onCancel: () => void;
  isDuplicate?: (note: Note) => boolean;
  profId: string;
  adminId: string;
};

type ClassesProfWithId = ClassesProf & { id: string };

const options = [
  { label: "Périodes", options: ["Période 1", "Période 2", "Période 3", "Période 4", "Période 5", "Période 6"] },
  { label: "Examens", options: ["Examen 1", "Examen 2", "Examen 3", "Examen de Repêchage"] },
]

// Fake lists (replace with real services later)



const NoteForm = ({ note, onSubmit, onCancel, isDuplicate,profId,adminId }: NoteFormProps) => {
  const [formData, setFormData] = useState<(Note)>({
    profId: '',
    studentId: '',
    classeId: '',
    anneeScolaireId: '',
    courId: '',
    cote: 0,
    isWithExam: false,
    periode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [getProfDetails, setGetProfDetails] = useState<any | null>(null);
  const [ecoleId, setEcoleId] = useState('');
  const [schoolsList, setSchoolsList] = useState<(School & {id:string})[]>([]);
  const [allClasses, setAllClasses] = useState<(Classe & { id: string })[]>([]);
  const [assignations, setAssignations] = useState<ClassesProfWithId>();
  const [mockAnnees,setMockAnnees] = useState<{ id: string; name: string; }[]>([{id:'',name:''}])
  const [mockCours,setmockCours] = useState<{ id: string; name: string; }[]>([{id:'',name:''}])
  const [mockStudents,setmockStudents] = useState<{ id: string; name: string; }[]>([{id:'',name:''}])
  const [getSubmitResult, setGetSubmitResult] = useState<any | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  

  useEffect(() => {
   setFormData((prev) => ({ ...prev, profId }));
    const getProfId = async () => {
      const prof : any= await getProfById(profId);
        if(prof){
          setGetProfDetails(prof);
          
          const all = await ClassesProfService.getByProfId(profId);
          setAssignations(all ? all : undefined);
        }
    };
    const fetchSchools = async () => {
      
        const schools = await SchoolService.getAllDocs(adminId);
        setSchoolsList(schools);
      
    };
    fetchSchools();
    getProfId();
    loadCours(profId);

  }, [profId])
  

  useEffect(() => {
    
    if (note) setFormData(note);
  }, [note]);

  useEffect(() => {
   loadClasses();
   loadAnneeScolaire(adminId);
  
  }, []);



  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.profId) newErrors.profId = 'Prof obligatoire';
    if (!formData.studentId) newErrors.studentId = 'Élève obligatoire';
    if (!formData.classeId) newErrors.classeId = 'Classe obligatoire';
    if (!formData.anneeScolaireId) newErrors.anneeScolaireId = 'Année obligatoire';
    if (!formData.courId) newErrors.courId = 'Cours obligatoire';
    if (formData.cote < 0 || formData.cote > 20) newErrors.cote = 'Cote 0–20';
    if (!formData.periode) newErrors.ponderation = 'Pondération > 0';
    if (isDirty && isDuplicate && isDuplicate(formData)) {
      
      newErrors.duplicate = 'Cette cote existe déjà';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isDirty) validateForm();
  }, [formData, isDirty]);

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
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDirty(true);
    if (isDirty && isDuplicate && isDuplicate(formData)) {
      showNotification("Cette cote existe déjà", 'error');
    }else{ 
      if (validateForm()){
        const data = await onSubmit({...formData,cote: +formData.cote});
        if (data) {
          showNotification('insertion avec succès', 'success');
        }else{
          showNotification("Erreur lors de l'insertion de cote", 'error');
        }
      }
    }
      
  };

  const filteredStudents = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const loadClasses = async () => {
    const data = await ClasseService.getAllByAdmin(adminId);
    setAllClasses(data);
  };

  const loadAnneeScolaire = async (id_admin: string) => {
    const isEmpty = [{id:'',name:''}]
    const data = await AnneeScolaireService.getAllByAdmin(id_admin);
    const getmockAnnees  = data.map(d => ({id:d.id,name:d.annee}));
    setMockAnnees(getmockAnnees || isEmpty)
  }

  const loadCours = async (profId:string) => {
   
      const data = await CoursService.getCourByProfId(profId);
      const getmockCours = data?.map(d => ({id:d.id,name:d.Nomcour}));
      setmockCours(getmockCours)
    
  }

const loadStudents = async (
  ecoleId: string,
  anneeScolaireId: string,
  classeId: string
) => {
  const isEmpty = [{ id: "", name: "" }];
  
  try {
    // Récupère toutes les inscriptions filtrées
    const data = await InscriptionService.getAllStudent({
      ecoleId,
      anneeScolaireId,
      classId: classeId,
    });
    
    // ⚠️ Vérifie que data existe et qu’il y a des inscriptions
    if (!data || data.length === 0) {
      setmockStudents(isEmpty);
      return;
    }
    
    // Extraire uniquement les IDs d’étudiants
    const idStudents = data.map((d) => d.idStudent);

    // Récupérer les détails des étudiants
    const students = await Promise.all(
      idStudents.map(async (id) => {
        const etudiant: any = await obtenirEtudiant(id);
        return {
          id,
          name: etudiant?.nomComplet || "",
        };
      })
    );

    setmockStudents(students);
  } catch (error) {
    
    setmockStudents(isEmpty);
  }
};

const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
};

useEffect(() => {
  if (ecoleId && formData.anneeScolaireId && formData.classeId) {
    setFormData((prev) => ({...prev,studentId: '',}))
    loadStudents(ecoleId, formData.anneeScolaireId, formData.classeId);
  }
}, [ecoleId, formData.anneeScolaireId, formData.classeId]);



  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-700">
            {note ? 'Modifier la cote' : 'Nouvelle cote'}
          </h2>
          {errors.duplicate && (
            <p className="text-red-600 bg-red-100 p-2 rounded">
              {errors.duplicate}
            </p>
          )}

          {/* Select Ecole */}
          <div>
            <label className="block text-sm font-medium">ecole *</label>
            <select
              name="ecoleId"
              value={ecoleId}
              onChange={(e) => setEcoleId(e.target.value)}
              className={`w-full border p-2 rounded ${
                errors.ecoleId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Choisir une ecole --</option>
              {getProfDetails?.teacher?.schools.map((schoolsId:string) => (
                <option key={schoolsId} value={schoolsId}>
                  {schoolsList.find(sch => sch.id === schoolsId)?.name || schoolsId}
                </option>
              ))}
            </select>
            {errors.anneeScolaireId && (
              <p className="text-red-600 text-sm">{errors.anneeScolaireId}</p>
            )}
          </div>

          {/* Select Classe */}
          <div>
            <label className="block text-sm font-medium">Classe *</label>
            <select
              name="classeId"
              value={formData.classeId}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.classeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Choisir une classe --</option>
              
              {assignations?.classeId.map(cid => {
                const classe = allClasses.find(c => c.id === cid);
                return classe ? <option key={cid} value={cid}>{classe.niveau+' '+classe.nom}</option> : null;
              })}
            </select>
            {errors.classeId && (
              <p className="text-red-600 text-sm">{errors.classeId}</p>
            )}
          </div>

          {/* Select Année */}
          <div>
            <label className="block text-sm font-medium">Année scolaire *</label>
            <select
              name="anneeScolaireId"
              value={formData.anneeScolaireId}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.anneeScolaireId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Choisir une année --</option>
              {mockAnnees.map((an) => (
                <option key={an.id} value={an.id}>
                  {an.name}
                </option>
              ))}
            </select>
            {errors.anneeScolaireId && (
              <p className="text-red-600 text-sm">{errors.anneeScolaireId}</p>
            )}
          </div>

          
          {/* Search & select student */}
          <div>
            <label className="block text-sm font-medium">Élève *</label>
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
            <div className="max-h-32 overflow-y-auto mt-2 border rounded">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <button
                    type="button"
                    key={student.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        studentId: student.id,
                      }))
                    }
                    className={`w-full text-left px-3 py-2 hover:bg-blue-50 ${
                      formData.studentId === student.id
                        ? 'bg-blue-100 font-semibold'
                        : ''
                    }`}
                  >
                    {student.name}
                  </button>
                ))
              ) : (
                <p className="p-2 text-sm text-gray-500">Aucun élève trouvé</p>
              )}
            </div>
            {errors.studentId && (
              <p className="text-red-600 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>


          {/* Select Cours */}
          <div>
            <label className="block text-sm font-medium">Cours *</label>
            <select
              name="courId"
              value={formData.courId}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.courId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Choisir un cours --</option>
              {mockCours.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.courId && (
              <p className="text-red-600 text-sm">{errors.courId}</p>
            )}
          </div>

          {/* Prof ID */}
          <div hidden>
            <label className="block text-sm font-medium">Professeur *</label>
            <input
              disabled
              type="text"
              name="profId"
              value={formData.profId}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.profId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.profId && (
              <p className="text-red-600 text-sm">{errors.profId}</p>
            )}
          </div>

          {/* Cote */}
          <div>
            <label className="block text-sm font-medium">Cote (0–20)</label>
            <input
              type="number"
              name="cote"
              value={formData.cote}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.cote ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Pondération */}
          <div>
            <label className="block text-sm font-medium">Période</label>
            <select
              name="periode"
              value={formData.periode}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.periode ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Choisir --</option>

              {options.map((group, idx) => (
                <optgroup key={idx} label={group.label}>
                  {group.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>


          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isWithExam"
              name="isWithExam"
              checked={formData.isWithExam}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="isWithExam">Avec examen ?</label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded-md text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              {note ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
      {notification.show && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
              {notification.message}
          </div>
      )}
    </div>
    
  );
};
export default NoteForm;
