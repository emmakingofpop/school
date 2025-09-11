// services/bulletinService.ts
import { NoteService } from "./NoteService";
import { InscriptionService } from "./InscriptionService";
import { obtenirEtudiant } from "./studentsServices";
import { CoursService } from "./CoursService";

export type NoteDetail = {
  type: string; // e.g. "Période 1", "Examen 1", "Total bloc 1"
  note: number;
  max: number;
  pourcentage: number;
};

export type BulletinCours = {
  cour: string;
  ponderation: number;
  details: NoteDetail[];
  total: number;
};

export type BulletinResult = {
  studentId: string;
  nomComplet: string;
  matricule: string;
  cours: BulletinCours[];
  totalGeneral: number;
  totalMax: number;
  moyenne: number;
  pourcentage: number;
  rang: number;
};

export const BulletinService = {
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

    // Structure de blocs
    const blocs =
      niveau === "primaire"
        ? [
            { periodes: ["Période 1", "Période 2"], examen: "Examen 1" },
            { periodes: ["Période 3", "Période 4"], examen: "Examen 2" },
            { periodes: ["Période 5", "Période 6"], examen: "Examen 3" },
          ]
        : [
            { periodes: ["Période 1", "Période 2"], examen: "Examen 1" },
            { periodes: ["Période 3", "Période 4"], examen: "Examen 2" },
          ];

    for (const inscription of inscriptions) {
      const etudiant = await obtenirEtudiant(inscription.idStudent);
      const cours = await CoursService.getAll();

      let totalGeneral = 0;
      let totalMax = 0;
      const coursResults: BulletinCours[] = [];

      for (const cour of cours) {
        const details: NoteDetail[] = [];
        let totalCours = 0;
        let totalMaxCours = 0;

        for (const bloc of blocs) {
          let subtotal = 0;
          let subtotalMax = 0;

          // Périodes
          for (const periode of bloc.periodes) {
            const notes = await NoteService.getNoteByStudent(
              etudiant.uid,
              classId,
              anneeScolaireId,
              cour.id,
              periode
            );
            const note = notes.length > 0 ? notes[0].cote : 0;
            const max = 20 * cour.ponderation;

            details.push({
              type: periode,
              note,
              max,
              pourcentage: (note / 20) * 100,
            });

            subtotal += note * cour.ponderation;
            subtotalMax += max;
          }

          // Examen (pondération double)
          const notesExam = await NoteService.getNoteByStudent(
            etudiant.uid,
            classId,
            anneeScolaireId,
            cour.id,
            bloc.examen
          );
          const noteExam = notesExam.length > 0 ? notesExam[0].cote : 0;
          const maxExam = 20 * cour.ponderation * 2;

          details.push({
            type: bloc.examen,
            note: noteExam,
            max: maxExam,
            pourcentage: (noteExam / 20) * 100,
          });

          subtotal += noteExam * cour.ponderation * 2;
          subtotalMax += maxExam;

          // Total du bloc
          details.push({
            type: `Total ${bloc.examen}`,
            note: subtotal,
            max: subtotalMax,
            pourcentage: subtotalMax > 0 ? (subtotal / subtotalMax) * 100 : 0,
          });

          totalCours += subtotal;
          totalMaxCours += subtotalMax;
        }

        coursResults.push({
          cour: cour.Nomcour,
          ponderation: cour.ponderation,
          details,
          total: totalCours,
        });

        totalGeneral += totalCours;
        totalMax += totalMaxCours;
      }

      const moyenne = totalMax > 0 ? (totalGeneral / totalMax) * 20 : 0;

      bulletins.push({
        studentId: etudiant.uid,
        nomComplet: etudiant.nomComplet,
        matricule: etudiant.matricule,
        cours: coursResults,
        totalGeneral,
        totalMax,
        moyenne,
        pourcentage: totalMax > 0 ? (totalGeneral / totalMax) * 100 : 0,
        rang: 0,
      });
    }

    // Classement
    bulletins.sort((a, b) => b.moyenne - a.moyenne);
    bulletins.forEach((b, i) => (b.rang = i + 1));

    return bulletins;
  },
};
