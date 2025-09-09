"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  obtenirEtudiant,
  mettreAJourEtudiant,
  Etudiant,
} from "../../../services/studentsServices";
import { School, SchoolService } from "../../../services/schoolService";
import { ClasseService } from "../../../services/ClasseService";
import { AnneeScolaire, AnneeScolaireService } from "@/app/services/AnneeScolaireService";

interface Props {
  studentId: string; // UID Firestore de l’étudiant
  AdminId: string;
}

export default function ModifierEtudiant({ studentId, AdminId }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<(Etudiant  & { anneeScolaireId: string })>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [schools, setSchools] = useState<(School & { id: string })[]>([]);
  const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
  const [anneeScolaire, setAnneeScolaire] = useState<(AnneeScolaire & {id: string;})[]>([]);

  // Charger infos étudiant + écoles + classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const etudiant = await obtenirEtudiant(studentId);
        setFormData(etudiant as Etudiant);

        const allSchools = await SchoolService.getAllDocs(AdminId);
        setSchools(allSchools);

        const anneeScolaire = await AnneeScolaireService.getAllByAdmin(AdminId);
        setAnneeScolaire(anneeScolaire);

        const allClasses = await ClasseService.getAllByAdmin(AdminId);
        const formattedClasses = allClasses.map((classe) => ({
          value: classe.id,
          label: classe.niveau + " - " + classe.nom,
        }));
        setClasses(formattedClasses);
      } catch (error: any) {
        setMessage("❌ " + error.message);
      }
    };

    fetchData();
  }, [studentId, AdminId]);

  // Gestion des inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await mettreAJourEtudiant(studentId, formData);
      setMessage("✅ Étudiant mis à jour avec succès !");
      router.refresh();
    } catch (error: any) {
      setMessage("❌ Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto shadow-lg rounded-xl p-6 mt-2">
      <h2 className="text-2xl font-bold mb-4">Modifier Étudiant</h2>
      {message && <p className="mt-3 text-center">{message}</p>}

      {Object.keys(formData).length === 0 ? (
        <p>Chargement des données...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 max-h-[60vh] overflow-y-scroll">
          {/* Matricule */}
          <label className="block text-sm font-medium">Matricule</label>
          <input
            type="text"
            name="matricule"
            className="w-full border p-2 rounded"
            value={formData.matricule || ""}
            disabled
            onChange={handleChange}
          />

          {/* Nom complet */}
          <label className="block text-sm font-medium">Nom complet</label>
          <input
            type="text"
            name="nomComplet"
            className="w-full border p-2 rounded"
            value={formData.nomComplet || ""}
            onChange={handleChange}
          />

          {/* Email */}
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border p-2 rounded"
            value={formData.email || ""}
            onChange={handleChange}
          />

          {/* Mot de passe */}
          <label className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            name="motDePasse"
            className="w-full border p-2 rounded"
            value={formData.motDePasse || ""}
            onChange={handleChange}
          />

          {/* Date de naissance */}
          <label className="block text-sm font-medium">Date de naissance</label>
          <input
            type="date"
            name="dateNaissance"
            className="w-full border p-2 rounded"
            value={formData.dateNaissance || ""}
            onChange={handleChange}
          />

          {/* Genre */}
          <label className="block text-sm font-medium">Genre</label>
          <select
            name="genre"
            className="w-full border p-2 rounded"
            value={formData.genre || "Masculin"}
            onChange={handleChange}
          >
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
            <option value="Autre">Autre</option>
          </select>

          {/* Adresse */}
          <label className="block text-sm font-medium">Adresse</label>
          <input
            type="text"
            name="adresse"
            className="w-full border p-2 rounded"
            value={formData.adresse || ""}
            onChange={handleChange}
          />

          {/* Téléphone étudiant */}
          <label className="block text-sm font-medium">Téléphone étudiant</label>
          <input
            type="text"
            name="telephone"
            className="w-full border p-2 rounded"
            value={formData.telephone || ""}
            onChange={handleChange}
          />

          {/* Tuteur */}
          <label className="block text-sm font-medium">Nom du tuteur</label>
          <input
            type="text"
            name="tuteurNom"
            className="w-full border p-2 rounded"
            value={formData.tuteurNom || ""}
            onChange={handleChange}
          />

          <label className="block text-sm font-medium">Téléphone du tuteur</label>
          <input
            type="text"
            name="tuteurTel"
            className="w-full border p-2 rounded"
            value={formData.tuteurTel || ""}
            onChange={handleChange}
          />

          {/* Classe */}
          <label className="block text-sm font-medium">Classe</label>
          <select
            name="classeId"
            className="w-full border p-2 rounded"
            value={formData.classeId || ""}
            onChange={handleChange}
          >
            <option value="">-- Sélectionner une classe --</option>
            {classes.map((classe) => (
              <option key={classe.value} value={classe.value}>
                {classe.label}
              </option>
            ))}
          </select>

          {/* École */}
          <label className="block text-sm font-medium">École</label>
          <select
            name="ecoleId"
            className="w-full border p-2 rounded"
            value={formData.ecoleId || ""}
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

          {/* Date admission */}
          <label className="block text-sm font-medium">Date d’admission</label>
          <input
            type="date"
            name="dateAdmission"
            className="w-full border p-2 rounded"
            value={formData.dateAdmission || ""}
            onChange={handleChange}
          />

          {/* Statut */}
          <label className="block text-sm font-medium">Statut</label>
          <select
            name="statut"
            className="w-full border p-2 rounded"
            value={formData.statut || "actif"}
            disabled
            onChange={handleChange}
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
          </select>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "⏳ Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      )}
    </div>
  );
}
