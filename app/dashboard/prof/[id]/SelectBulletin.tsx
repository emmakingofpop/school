import React, { useEffect, useState } from 'react'
import BulletinLayout from './bulletinLayout'
import {AnneeScolaireService} from '../../../services/AnneeScolaireService';
import {School, SchoolService} from '../../../services/schoolService';
import { Classe,ClasseService } from '../../../services/ClasseService';

interface Props {
  adminId: string;
}

function SelectBulletin({ adminId }: Props) {
    const [ecoleId, setEcoleId] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [getProfDetails, setGetProfDetails] = useState<any | null>(null);
    const [schoolsList, setSchoolsList] = useState<(School & {id:string})[]>([]);
    const [allClasses, setAllClasses] = useState<(Classe & { id: string })[]>([]);
    const [mockAnnees,setMockAnnees] = useState<{ id: string; name: string; }[]>([{id:'',name:''}])
    const [formData, setFormData] = useState<{classeId:string,anneeScolaireId:string}>({
        classeId: '',
        anneeScolaireId: '',
      });

    useEffect(() => {
    loadClasses();
    loadAnneeScolaire(adminId);
    fetchSchools(adminId);
    }, []);


    

const fetchSchools = async (adminId:string) => {
    const schools = await SchoolService.getAllDocs(adminId);
    setSchoolsList(schools);
};
    
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



  return (
    <div>
        <div>
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
              {schoolsList.map((school) => (
                <option key={school.id} value={school.id}>
                  {school?.name || ''}
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
              
              {allClasses.map(classe => {
                
                return classe ? <option key={classe.id} value={classe.id}>{classe.niveau+' '+classe.nom}</option> : null;
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

        </div>

       <BulletinLayout classId={formData.classeId} anneeScolaireId={formData.anneeScolaireId} ecoleId={ecoleId} />
    
    </div>
  )
}

export default SelectBulletin
