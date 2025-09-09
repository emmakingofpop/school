"use client";

import { useEffect, useState } from "react";
import { inscrireEtudiant, Etudiant } from "../../services/studentsServices";
import { useRouter } from "next/navigation";
import { School, SchoolService } from "../../services/schoolService";
import { ClasseService } from "../../services/ClasseService";
import { AnneeScolaire, AnneeScolaireService } from "../../services/AnneeScolaireService";
import {InscriptionService} from "../../services/InscriptionService";
import {generateUniqueMatricule} from "../../services/studentsServices";

interface Props {
  AdminId: string;
}

export default function PageInscriptionEtudiant({ AdminId }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<(Etudiant  & { anneeScolaireId: string })>({
    matricule: "",
    nomComplet: "",
    email: "",
    motDePasse: "",
    dateNaissance: "",
    genre: "Masculin",
    adresse: "",
    telephone: "",
    tuteurNom: "",
    tuteurTel: "",
    classeId: "",
    ecoleId: "",
    anneeScolaireId: "",
    dateAdmission: new Date().toISOString().split("T")[0],
    statut: "actif",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [schools, setSchools] = useState<(School & { id: string })[]>([]);
  const [anneeScolaire, setAnneeScolaire] = useState<(AnneeScolaire & {id: string;})[]>([]);
  const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);


  useEffect(() => {
   
   async function fetchMatricule() {
    const newMatricule = await generateUniqueMatricule();
    setFormData((prev) => ({ ...prev, matricule: newMatricule }));
  }
  
    const schools = async () => {
      const data = await SchoolService.getAllDocs(AdminId);
      if (data.length > 0) {
        setSchools(data);
      }
    };
    const anneeScolaire = async () => {
      const data = await AnneeScolaireService.getAllByAdmin(AdminId);
      if (data.length > 0) {
        setAnneeScolaire(data);
      }
    };
    const classes = async () => {
      const data = await ClasseService.getAllByAdmin(AdminId);
      if (data.length > 0) {
        const formattedClasses = data.map((classe) => ({
          value: classe.id,
          label: classe.niveau + " - " + classe.nom,
        }));
        setClasses(formattedClasses);
      }
    };
    fetchMatricule();
    anneeScolaire();
    classes();
    schools();
  }, [AdminId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // reset field error when typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const routing = (route: string) => {
    router.push("/" + route);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.matricule.trim()) errors.matricule = "Matricule requis.";
    if (!formData.nomComplet.trim()) errors.nomComplet = "Nom complet requis.";
    if (!formData.email.trim()) errors.email = "Email requis.";
    if (!formData.motDePasse.trim())
      errors.motDePasse = "Mot de passe requis.";
    if (!formData.dateNaissance.trim())
      errors.dateNaissance = "Date de naissance requise.";
    if (!formData.classeId.trim()) errors.classeId = "Choisissez une classe.";
    if (!formData.ecoleId.trim()) errors.ecoleId = "Choisissez une école.";

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const user = await inscrireEtudiant(formData);
      const inscription = await InscriptionService.add({
        idStudent: user?.uid as string,
        classId: formData.classeId,
        anneeScolaireId: formData.anneeScolaireId,
        ecoleId: formData.ecoleId,
        status: formData.statut as 'active' | 'inactive' | 'graduated',
      });
      inscription && setMessage("✅ Étudiant inscrit avec succès !");
      localStorage.setItem('masomo_student', user ? user.uid : '');
      routing("dashboard/students/" + AdminId);
    } catch (error: any) {
      setLoading(false);
      setMessage("❌ Erreur : " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Inscription Étudiant</h2>
      {message && <p className="mt-3 text-center">{message}</p>}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 h-[70dvh] overflow-y-scroll"
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Matricule
        </label>
        <input
          type="text"
          name="matricule"
          className="w-full border p-2 rounded"
          value={formData.matricule}
          onChange={handleChange}
          disabled={true}
        />
        {formErrors.matricule && (
          <p className="text-red-500 text-sm">{formErrors.matricule}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet
        </label>
        <input
          type="text"
          name="nomComplet"
          className="w-full border p-2 rounded"
          value={formData.nomComplet}
          onChange={handleChange}
        />
        {formErrors.nomComplet && (
          <p className="text-red-500 text-sm">{formErrors.nomComplet}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={handleChange}
        />
        {formErrors.email && (
          <p className="text-red-500 text-sm">{formErrors.email}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          name="motDePasse"
          className="w-full border p-2 rounded"
          value={formData.motDePasse}
          onChange={handleChange}
        />
        {formErrors.motDePasse && (
          <p className="text-red-500 text-sm">{formErrors.motDePasse}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de naissance
        </label>
        <input
          type="date"
          name="dateNaissance"
          className="w-full border p-2 rounded"
          value={formData.dateNaissance}
          onChange={handleChange}
        />
        {formErrors.dateNaissance && (
          <p className="text-red-500 text-sm">{formErrors.dateNaissance}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Genre
        </label>
        <select
          name="genre"
          className="w-full border p-2 rounded"
          value={formData.genre}
          onChange={handleChange}
        >
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
          <option value="Autre">Autre</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <input
          type="text"
          name="adresse"
          className="w-full border p-2 rounded"
          value={formData.adresse}
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone étudiant
        </label>
        <input
          type="text"
          name="telephone"
          className="w-full border p-2 rounded"
          value={formData.telephone}
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom du tuteur
        </label>
        <input
          type="text"
          name="tuteurNom"
          className="w-full border p-2 rounded"
          value={formData.tuteurNom}
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone du tuteur
        </label>
        <input
          type="text"
          name="tuteurTel"
          className="w-full border p-2 rounded"
          value={formData.tuteurTel}
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Classe
        </label>
        <select
          name="classeId"
          className="w-full border p-2 rounded"
          value={formData.classeId}
          onChange={handleChange}
        >
          <option value="">-- Sélectionner une classe --</option>
          {classes.map((classe) => (
            <option key={classe.value} value={classe.value}>
              {classe.label}
            </option>
          ))}
        </select>
        {formErrors.classeId && (
          <p className="text-red-500 text-sm">{formErrors.classeId}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          École
        </label>
        <select
          name="ecoleId"
          className="w-full border p-2 rounded"
          value={formData.ecoleId}
          onChange={handleChange}
        >
          <option value="">-- Sélectionner une école --</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
        <label className="block text-sm font-medium">Annee Scolaire</label>
        <select
          name="anneeScolaireId"
          className="w-full border p-2 rounded"
          value={formData.anneeScolaireId}
          onChange={handleChange}
        >
          <option value="">-- Sélectionner une année scolaire --</option>
          {anneeScolaire.map((annee) => (
            <option key={annee.id} value={annee.id}>
              {annee.annee}
            </option>
          ))}
        </select>

        {formErrors.ecoleId && (
          <p className="text-red-500 text-sm">{formErrors.ecoleId}</p>
        )}

        <input
          type="date"
          name="dateAdmission"
          className="w-full border p-2 rounded"
          value={formData.dateAdmission}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "⏳ En cours..." : "Inscrire"}
        </button>
      </form>
    </div>
  );
}
