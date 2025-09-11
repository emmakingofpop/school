import React, { useEffect, useState,useRef } from 'react'
import { useReactToPrint } from "react-to-print";
import {Etudiant, obtenirEtudiant} from "../../../../services/studentsServices"
import {ClasseService,Classe} from "../../../../services/ClasseService"
import {SchoolService,School}  from "../../../../services/schoolService"
import {AnneeScolaireService,AnneeScolaire}  from "../../../../services/AnneeScolaireService"
import { Cours, CoursService } from '@/app/services/CoursService'
import { Note,NoteService } from '@/app/services/NoteService'

interface Props {
  idStudent:string;
  classeId: string;
  anneeScolaireId: string;
  ecoleId: string;
}

type EtudiantWithId = Etudiant & {
    uid: string;
}

type CoursWithId = Cours & {
    id: string;
}

type NoteWithId = Note & { id: string }

function BulletinSecondaire({ idStudent,classeId, anneeScolaireId, ecoleId }: Props) {
    const [student,setStudent] = useState<EtudiantWithId>()
    const [classe,setClasse] = useState<Classe|null>(null)
    const [school,setSchool] = useState<School|null>(null)
    const [cours,setCours] = useState<CoursWithId[]>()
    const [note,setNote] = useState<NoteWithId[]>()
    const [anneeScolaire,setAnneeScolaire] = useState<AnneeScolaire|null>(null)
    const divRef = useRef<HTMLTableElement>(null);

    const handlePrint = useReactToPrint({
        documentTitle: `${student?.matricule} ${student?.nomComplet} ${classe?.niveau}  ${classe?.nom}  Bulletin Scolaire`, 
        contentRef: divRef, // <-- what to print
    });

    useEffect(() => {
      LoadStudent(idStudent)
      LoadClasse(classeId)
      LoadScool(ecoleId)
      LoadAnneeScolaire(anneeScolaireId)
      LoadCours(classeId)
      LoadNotes(idStudent,classeId,anneeScolaireId)
    }, [idStudent,classeId,ecoleId,anneeScolaireId])

    const LoadNotes = async (studentId: string,classeId: string,anneeScolaireId: string) => {
        const data : NoteWithId[] = await NoteService.getNoteByStudentInClass(studentId,classeId,anneeScolaireId)
        setNote(data)
        console.log(data)
    }

    const Cotes = (courId:string,ponderation:number,periode:string) =>{
        if(!note) return 0
        const cote = note.find(cot => cot.periode === periode && cot.courId === courId)?.cote
        if (cote) {
            return cote >= (ponderation/2) ? (
                <td className="border border-gray-400 px-4 py-2">{cote}</td>
            ):(
                <td className="border border-gray-400 px-4 py-2 text-red-700">{cote}</td>
            )
        }
        
    }

    const premierSemestreTot = (courId:string,ponderation:number) => {
        if(!note) return 0
        const premierPeriode   = note?.find(cot => cot.periode === 'Période 1' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 1' && cot.courId === courId)?.cote : 0
        const deuxiemePeriode = note?.find(cot => cot.periode === 'Période 2' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 2' && cot.courId === courId)?.cote : 0
        const examenPremierSemestre = note?.find(cot => cot.periode === 'Examen 1' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Examen 1' && cot.courId === courId)?.cote : 0
        
        if (premierPeriode && deuxiemePeriode && examenPremierSemestre) {
            const cote = premierPeriode + deuxiemePeriode + examenPremierSemestre
            return cote >= ((ponderation * 4)/2) ? (
                <td className="border border-gray-400 px-4 py-2">{cote}</td>
            ):(
                <td className="border border-gray-400 px-4 py-2 text-red-700">{cote}</td>
            )
        }
    }
    const deuxiemeSemestreTot = (courId:string,ponderation:number) => {
        if(!note) return 0
        const troisiemePeriode   = note?.find(cot => cot.periode === 'Période 3' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 3' && cot.courId === courId)?.cote : 0
        const quatriemePeriode = note?.find(cot => cot.periode === 'Période 4' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 4' && cot.courId === courId)?.cote : 0
        const examenDeuxiemeSemestre = note?.find(cot => cot.periode === 'Examen 2' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Examen 2' && cot.courId === courId)?.cote : 0
        
        if (troisiemePeriode && quatriemePeriode && examenDeuxiemeSemestre) {
            const cote = troisiemePeriode + quatriemePeriode + examenDeuxiemeSemestre
            return cote >= ((ponderation * 4)/2) ? (
                <td className="border border-gray-400 px-4 py-2">{cote}</td>
            ):(
                <td className="border border-gray-400 px-4 py-2 text-red-700">{cote}</td>
            )
        }
    }

    const totalGeneral = (courId:string,ponderation:number) => {
        if(!note) return 0
        const premierPeriode   = note?.find(cot => cot.periode === 'Période 1' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 1' && cot.courId === courId)?.cote : 0
        const deuxiemePeriode = note?.find(cot => cot.periode === 'Période 2' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 2' && cot.courId === courId)?.cote : 0
        const examenPremierSemestre = note?.find(cot => cot.periode === 'Examen 1' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Examen 1' && cot.courId === courId)?.cote : 0
        
        const troisiemePeriode   = note?.find(cot => cot.periode === 'Période 3' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 3' && cot.courId === courId)?.cote : 0
        const quatriemePeriode = note?.find(cot => cot.periode === 'Période 4' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Période 4' && cot.courId === courId)?.cote : 0
        const examenDeuxiemeSemestre = note?.find(cot => cot.periode === 'Examen 2' && cot.courId === courId)?.cote ? note?.find(cot => cot.periode === 'Examen 2' && cot.courId === courId)?.cote : 0
        
        if (premierPeriode && deuxiemePeriode && examenPremierSemestre && troisiemePeriode && quatriemePeriode && examenDeuxiemeSemestre) {
            const cote = premierPeriode + deuxiemePeriode + examenPremierSemestre + troisiemePeriode + quatriemePeriode + examenDeuxiemeSemestre
            return cote >= ((ponderation * 8)/2) ? (
                <td className="border border-gray-400 px-4 py-2">{cote}</td>
            ):(
                <td className="border border-gray-400 px-4 py-2 text-red-700">{cote}</td>
            )
        }

    }

    const totaux = (periode: string) => {
        if (!note) return 0;

        return note.filter(cot => cot.periode === periode).reduce((sum, cot) => sum + (cot.cote || 0), 0);   
    };

    const totauxPremierSemestre = () => {
        if(!note) return 0 

        const premierPeriode   = note.filter(cot => cot.periode === 'Période 1').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const deuxiemePeriode = note.filter(cot => cot.periode === 'Période 2').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const examenPremierSemestre = note.filter(cot => cot.periode === 'Examen 1').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        
        if (premierPeriode && deuxiemePeriode && examenPremierSemestre) {
            const cote = premierPeriode + deuxiemePeriode + examenPremierSemestre
            return cote
        }

        return 0

    }
    const totauxDeuxiemeSemestre = () => {
        if(!note) return 0 
        
        const troisiemePeriode   = note.filter(cot => cot.periode === 'Période 3').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const quatriemePeriode = note.filter(cot => cot.periode === 'Période 4').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const examenDeuxiemeSemestre = note.filter(cot => cot.periode === 'Examen 2').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        
        if (troisiemePeriode && quatriemePeriode && examenDeuxiemeSemestre) {
            const cote = troisiemePeriode + quatriemePeriode + examenDeuxiemeSemestre
            return cote
        }

        return 0

    }

    const totauxGeneralDeDeuxSemestres = () => {
        if(!note) return 0 
        const premierPeriode   = note.filter(cot => cot.periode === 'Période 1').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const deuxiemePeriode = note.filter(cot => cot.periode === 'Période 2').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const examenPremierSemestre = note.filter(cot => cot.periode === 'Examen 1').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const troisiemePeriode   = note.filter(cot => cot.periode === 'Période 3').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const quatriemePeriode = note.filter(cot => cot.periode === 'Période 4').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        const examenDeuxiemeSemestre = note.filter(cot => cot.periode === 'Examen 2').reduce((sum, cot) => sum + (cot.cote || 0), 0);
        
        if (premierPeriode && deuxiemePeriode && examenPremierSemestre && troisiemePeriode && quatriemePeriode && examenDeuxiemeSemestre) {
            const cote = premierPeriode + deuxiemePeriode + examenPremierSemestre + troisiemePeriode + quatriemePeriode + examenDeuxiemeSemestre
            return cote
        }

        return 0

    }

    const maximaGeneraux = () => {
        if(!cours) return 0 
        return cours.map((c)=>c.ponderation).reduce((sum, ponderation) => sum + (ponderation || 0), 0);
    }
    

    const LoadCours = async (classeId:string) => {
        const data : CoursWithId[] = await CoursService.getCourByClassefId(classeId)
        setCours(data)
        
    }

    const LoadAnneeScolaire = async (anneeScolaireId:string) => {
        const data : AnneeScolaire | null = await AnneeScolaireService.getById(anneeScolaireId)
        setAnneeScolaire(data)
    }

    const LoadScool = async (ecoleId:string) => {
        const data : School | null = await SchoolService.getById(ecoleId)
        setSchool(data)
    }
    
    const LoadClasse = async (classeId:string) => {
        const data : Classe|null = await ClasseService.getById(classeId)
        setClasse(data)
        
    }

    const LoadStudent = async (idStudent: string) => {
        const data : EtudiantWithId = await obtenirEtudiant(idStudent)
        setStudent(data)
        
    }

  return (
<div className="relative p-6 h-[100dvh] overflow-x-auto overflow-y-auto">
    

<button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded">
    Print : {student?.matricule} {student?.nomComplet} {classe?.niveau}  {classe?.nom}
</button>
  <table ref={divRef} className="table-fixed border border-gray-400 text-black">
  <thead className="bg-gray-200">
    <tr>
      <th colSpan={12} className="border border-gray-400 px-4 py-2 w-full">
        <div className="flex justify-between w-full">
          <img src="/drapeaux.png" className="w-20 h-15" />
          <div>
            <h1>Republique Democratique du congo</h1>
            <h2>MINISTERE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECNIQUE</h2>
          </div>
          <img src="/jpt.png" className="w-20 h-15" />
        </div>
      </th>
      
    </tr>
  </thead>
  <tbody>
    <tr className="bg-white">
      <td colSpan={12} className="border border-gray-400 px-4 py-2">
          <div>
                <span className="font-bold">N* ID : </span><span className="border px-2 py-0.5 m-0.5 border-b-black">7</span>
          </div>
      </td>
      
    </tr>
    <tr className="bg-white">
      <td colSpan={12} className="border border-gray-400 px-4 py-2">
          <div className="flex justify-between">
                <p><span className="font-bold">PROVINCE :</span> HAUT - KATANGA</p>
                <p><span className="font-bold">MATRICULE :</span> {student?.matricule}</p>
          </div>
      </td>
    </tr>
    <tr className="bg-white">
      <td colSpan={6} className="border border-gray-400 px-4 py-2">
          <div>
                <p><span className="font-bold">VILLE :</span> LUBUMBASHI</p>
                <p><span className="font-bold">COMMUNE/TERRITOIRE :</span> LUBUMBASHI</p>
                <p><span className="font-bold">ECOLE :</span> {school?.name}</p>
                <p><span className="font-bold">CODE :</span> <span className="border px-2 py-0.5 m-0.5 border-b-black">7</span></p>
          </div>
      </td>
      <td colSpan={6} className="border border-gray-400 px-4 py-2">
          <div>
                <p><span className="font-bold">ELEVE :</span> {student?.nomComplet}</p>
                <p><span className="font-bold">Ne (e) a :</span> .........., Le {student?.dateNaissance}</p>
                <p><span className="font-bold">CLASSE :</span> {classe?.niveau+' '+classe?.nom}</p>
                <p><span className="font-bold">N* PERM :</span> <span className="border px-2 py-0.5 m-0.5 border-b-black">7</span></p>
          </div>
      </td>
    </tr>
    <tr className="bg-white">
      <td colSpan={12} className="border border-gray-400 px-4 py-2">
          <div className="flex justify-center items-center">
                <p><span className="font-bold">BULLETIN DE LA {classe?.niveau+' '+classe?.nom} ANNEE SCOLAIRE {anneeScolaire?.annee}</span> </p>
                
          </div>
      </td>
    </tr>

    <tr className="bg-white">
      <td rowSpan={3} className="border border-gray-400 px-4 py-2">
          <div className="flex justify-center items-center">
                <p><span className="font-bold">BRANCHES</span> </p>
          </div>
      </td>
      
      <td colSpan={4} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
                <p><span className="font-bold">PREMIER SEMESTRE</span> </p>
          </div>
      </td>
      <td colSpan={4} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
                <p><span className="font-bold">SECOND SEMESTRE</span> </p>
          </div>
      </td>
      <td rowSpan={3} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
              <p><span className="font-bold">T.G.</span> </p>
        </div>
      </td>
      <td colSpan={2} rowSpan={2} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
                <p><span className="font-bold">EXAMEN DE REPECHAGE</span> </p>
          </div>
        </td>
    </tr>
    <tr className="bg-gray-50">
      
      <td colSpan={2} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
                <p><span className="font-bold">TR. JOURNAL</span> </p>
          </div>
      </td>
      <td rowSpan={2} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
              <p><span className="font-bold">EXAM.</span> </p>
        </div>
      </td>
      <td rowSpan={2} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
              <p><span className="font-bold">TOT.</span> </p>
        </div>
      </td>
      
      <td colSpan={2} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
                <p><span className="font-bold">TR. JOURNAL</span> </p>
          </div>
      </td>
      <td rowSpan={2} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
              <p><span className="font-bold">EXAM.</span> </p>
        </div>
      </td>
      <td rowSpan={2} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
              <p><span className="font-bold">TOT.</span> </p>
        </div>
      </td>

    </tr>
    <tr className="bg-gray-50">
      <td className="border border-gray-400 px-4 py-2 font-bold">1ere P</td>
      <td className="border border-gray-400 px-4 py-2 font-bold">2eme P</td>
            <td className="border border-gray-400 px-4 py-2 font-bold">3ere P</td>
      <td className="border border-gray-400 px-4 py-2 font-bold">4eme P</td>
      <td className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
              <p><span className="font-bold">%</span> </p>
        </div>
      </td>
      <td className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
              <p><span className="font-bold">SIGN. PROF</span> </p>
        </div>
      </td>

    </tr>

    {cours?.map((c, i, arr) => (
      <React.Fragment key={c.id}>
        {/* Render a group row only when ponderation changes */}
        {(i === 0 || c.ponderation !== arr[i - 1].ponderation) && (
                    
            <tr key={i} className="bg-gray-50 font-bold">
                <td className="border border-gray-400 px-4 py-2">MAXIMA</td>
                {Array.from({ length: 9 }).map((_, e) => (
                    <>
                        {(e+1 === 1 || e+1 === 2 || e+1 === 5 || e+1 === 6) && <td key={Math.random()} className="border border-gray-400 px-4 py-2">{c.ponderation}</td>}
                        {(e+1 ===3 || e+1 ===7) && <td key={Math.random()} className="border border-gray-400 px-4 py-2">{c.ponderation*2}</td>}
                        {(e+1 ===4 || e+1 ===8) && <td key={Math.random()} className="border border-gray-400 px-4 py-2">{c.ponderation*4}</td>}
                        {(e+1 ===9) && <td key={Math.random()} className="border border-gray-400 px-4 py-2">{c.ponderation*8}</td>}
                    </>
                ))}
                <td colSpan={2} className="border border-gray-400 px-4 py-2 bg-black"></td>
            </tr>

        )}

        <tr key={c.id} className="bg-gray-50 ">
            <td className="border border-gray-400 px-4 py-2 ">{c.Nomcour}</td>
            {Cotes(c.id,c.ponderation,'Période 1')}
            {Cotes(c.id,c.ponderation,'Période 2')}
            {Cotes(c.id,c.ponderation,'Examen 1')}
            {premierSemestreTot(c.id,c.ponderation)}
            {Cotes(c.id,c.ponderation,'Période 3')}
            {Cotes(c.id,c.ponderation,'Période 4')}
            {Cotes(c.id,c.ponderation,'Examen 2')}
            {deuxiemeSemestreTot(c.id,c.ponderation)}
            {totalGeneral(c.id,c.ponderation)}
            <td className="border border-gray-400 px-4 py-2"></td>
            <td className="border border-gray-400 px-4 py-2"></td>
        </tr>
      </React.Fragment>
    ))}



    
    
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">MAXIMA GENERAUX</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()*2}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()*4}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()*2}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()*4}</td>
      <td className="border border-gray-400 px-4 py-2 text-red-600">{maximaGeneraux()*8}</td>
      
      <td colSpan={2} rowSpan={7} className="border border-gray-400 px-4 py-2">
        <div className="flex flex-col gap-4">
              <p><span className="font-bold">- PASSE (1) </span> </p>
              <p><span className="font-bold">- DOUBLE (2) </span> </p>
              <p><span className="font-bold">LE....../........./20...... </span> </p>
              <p>Le Chef d'Etablissement Sceau de l'ecole</p>
        </div>
      </td>
    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">TOTAUX</td>
      <td className="border border-gray-400 px-4 py-2">{totaux('Période 1')}</td>
      <td className="border border-gray-400 px-4 py-2">{totaux('Période 2')}</td>
      <td className="border border-gray-400 px-4 py-2">{totaux('Examen 1')}</td>
      <td className="border border-gray-400 px-4 py-2">{totauxPremierSemestre()}</td>
      <td className="border border-gray-400 px-4 py-2">{totaux('Période 3')}</td>
      <td className="border border-gray-400 px-4 py-2">{totaux('Période 4')}</td>
      <td className="border border-gray-400 px-4 py-2">{totaux('Examen 2')}</td>
      <td className="border border-gray-400 px-4 py-2">{totauxDeuxiemeSemestre()}</td>
      <td className="border border-gray-400 px-4 py-2">{totauxGeneralDeDeuxSemestres()}</td>
    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">POURCENTAGE</td>
      <td className="border border-gray-400 px-4 py-2">
        {((totaux('Période 1') / maximaGeneraux()) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totaux('Période 2') / maximaGeneraux()) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totaux('Examen 1') / (maximaGeneraux() * 2)) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totauxPremierSemestre() / (maximaGeneraux() * 4)) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totaux('Période 3') / maximaGeneraux()) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totaux('Période 4') / maximaGeneraux()) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totaux('Examen 2') / (maximaGeneraux() * 2)) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totauxDeuxiemeSemestre() / (maximaGeneraux() * 4)) * 100).toFixed(2)}%
        </td>
        <td className="border border-gray-400 px-4 py-2">
        {((totauxGeneralDeDeuxSemestres() / (maximaGeneraux() * 8)) * 100).toFixed(2)}%
        </td>

    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">PLACE / NBRE D'ELEVES</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">APPLICATION</td>
      <td className="border border-gray-400 px-4 py-2">TB</td>
      <td className="border border-gray-400 px-4 py-2">TB</td>
      <td colSpan={2} className="border border-gray-400 px-4 py-2 bg-black">0</td>
      <td className="border border-gray-400 px-4 py-2">TB</td>
      <td className="border border-gray-400 px-4 py-2">TB</td>
      <td colSpan={3} className="border border-gray-400 px-4 py-2 bg-black"></td>

    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">CONDUITE</td>
      <td className="border border-gray-400 px-4 py-2">B</td>
      <td className="border border-gray-400 px-4 py-2">B</td>
      <td colSpan={2} className="border border-gray-400 px-4 py-2 bg-black">0</td>
      <td className="border border-gray-400 px-4 py-2">B</td>
      <td className="border border-gray-400 px-4 py-2">B</td>
      <td colSpan={3} className="border border-gray-400 px-4 py-2 bg-black"></td>
    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">SIGN. DU RESPONSABLE</td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
    </tr>
    
    <tr className="bg-gray-50 font-bold">
        <td colSpan={12} className="border border-gray-400 px-4 py-2">
            <p className='p-4'>
                l'eleve ne pourra passer dans la classe superieure s'il n'a subi avec succes un examen de repechage en
                <span>..................................................................................................</span>
                <span>..................................................................................................</span>
                <span>..................................................................................................</span>
                <span>..................................................................................................</span>
                <span>..................................................................................................</span>
                <span>..................................................................................................</span>
            </p>
            <p className='p-4'>
                - L'eleve passe dans la classe superieure (1)
            </p>
            <div className='flex justify-between p-4 '>
                <p>- L'eleve double la classe (1)</p>
                <p>Fait a .................................. , le ........../........./20</p>
            </div>
            <div className='flex justify-between p-4 '>
                <div>
                    <p className='font-bold'>Signature de l'eleve</p>
                    <p>(1) Biffer la mention inutile.</p>
                    <p>Note importante L Le bulletin est sans valeur s'il est rature ou sercharge.</p>
                </div>
                <p className='font-bold'>Sceau de l'ecole</p>
                <div>
                    <p className='py-20'>Le Chef d'Etablissement,</p>
                    <p>Nom Signature</p>
                </div>
            </div>
            <p className='text-center py-10'>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prevues par la loi</p>
        </td>
    </tr>
  </tbody>
</table>

    </div>
  )
}

export default BulletinSecondaire
