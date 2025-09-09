// services/bulletinService.ts
import { NoteService } from "./NoteService";
import { InscriptionService } from "./InscriptionService";
import { obtenirEtudiant } from "./studentsServices";
import { CoursService } from "./CoursService";

export type BulletinResult = {
  studentId: string;
  nomComplet: string;
  matricule: string;
  notes: {
    cour: string;
    periodes: { [periode: string]: number };
    examens: { [examen: string]: number };
    total: number;
  }[];
  moyenne: number;
  pourcentage: number;
  rang: number;
};

export const BulletinService = {
  // 🔹 Charger les bulletins d’une classe et année scolaire
  async getBulletins(
    classId: string,
    anneeScolaireId: string,
    ecoleId: string,
    niveau: "primaire" | "secondaire" = "secondaire"
  ): Promise<BulletinResult[]> {
    const inscriptions = await InscriptionService.getAllStudent({
      classId,
      anneeScolaireId,
      ecoleId,
    });

    const bulletins: BulletinResult[] = [];

    // 📌 Définition des périodes/examens selon niveau
    const periodes =
      niveau === "primaire"
        ? ["Période 1", "Période 2", "Période 3", "Période 4", "Période 5", "Période 6"]
        : ["Période 1", "Période 2", "Période 3", "Période 4"];

    const examens =
      niveau === "primaire"
        ? ["Examen 1", "Examen 2", "Examen 3", "Examen de Repêchage"]
        : ["Examen 1", "Examen 2", "Examen de Repêchage"];

    for (const inscription of inscriptions) {
      const etudiant = await obtenirEtudiant(inscription.idStudent);
      const cours = await CoursService.getAll();

      let totalPoints = 0;
      let totalPonderation = 0;
      const notesEtudiant = [];

      for (const cour of cours) {
        const periodesNotes: Record<string, number> = {};
        const examensNotes: Record<string, number> = {};

        // ⚡ Charger notes par périodes
        for (const periode of periodes) {
          const notes = await NoteService.getNoteByStudent(
            etudiant.uid,
            classId,
            anneeScolaireId,
            cour.id,
            periode
          );
          periodesNotes[periode] = notes.length > 0 ? notes[0].cote : 0;
        }

        // ⚡ Charger notes examens
        for (const examen of examens) {
          const notes = await NoteService.getNoteByStudent(
            etudiant.uid,
            classId,
            anneeScolaireId,
            cour.id,
            examen
          );
          examensNotes[examen] = notes.length > 0 ? notes[0].cote : 0;
        }

        // ⚖️ Calcul total avec pondération
        let total = 0;

        // Périodes (pondération simple)
        for (const [_, note] of Object.entries(periodesNotes)) {
          total += note * cour.ponderation;
        }

        // Examens (pondération double)
        for (const [_, note] of Object.entries(examensNotes)) {
          total += note * (cour.ponderation * 2);
        }

        totalPoints += total;
        totalPonderation +=
          cour.ponderation * periodes.length +
          cour.ponderation * 2 * examens.length;

        notesEtudiant.push({
          cour: cour.Nomcour,
          periodes: periodesNotes,
          examens: examensNotes,
          total,
        });
      }

      // 🎯 Moyenne de l'élève ramenée sur 20
      const moyenne = totalPonderation > 0 ? totalPoints / totalPonderation : 0;

      bulletins.push({
        studentId: etudiant.uid,
        nomComplet: etudiant.nomComplet,
        matricule: etudiant.matricule,
        notes: notesEtudiant,
        moyenne,
        pourcentage: moyenne, // sur 20
        rang: 0, // 🏆 sera calculé après
      });
    }

    // 🏆 Classement par moyenne
    bulletins.sort((a, b) => b.moyenne - a.moyenne);
    bulletins.forEach((b, idx) => (b.rang = idx + 1));

    return bulletins;
  },

  // 🔍 Recherche
  async searchBulletins(
    bulletins: BulletinResult[],
    query: string
  ): Promise<BulletinResult[]> {
    return bulletins.filter(
      (b) =>
        b.nomComplet.toLowerCase().includes(query.toLowerCase()) ||
        b.matricule.toLowerCase().includes(query.toLowerCase())
    );
  },
};
