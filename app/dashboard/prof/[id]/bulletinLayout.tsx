"use client";
import React, { useEffect, useState } from "react";
import {Inscription, InscriptionService} from "../../../services/InscriptionService"
import { BulletinService, BulletinResult, BulletinCours } from "../../../services/bulletinService";
import BulletinPrimaire from "./components/BulletinPrimaire";
import BulletinSecondaire from "./components/BulletinSecondaire";

interface Props {
  classId: string;
  anneeScolaireId: string;
  ecoleId: string;
  niveau: "primaire" | "secondaire";
}

type InscriptionWithId = Inscription & {id:string}

export default function BulletinLayout({ classId, anneeScolaireId, ecoleId, niveau }: Props) {
  const [inscription, setInscription] = useState<InscriptionWithId[]>([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      LoadInscription({classId,anneeScolaireId,ecoleId})
      
  }, [classId,anneeScolaireId,ecoleId])


  const LoadInscription = async (datas: { 
    classId: string; 
    anneeScolaireId: string; 
    ecoleId: string; 
  }) => {
      const data : InscriptionWithId[] = await InscriptionService.getAllStudent({classId,anneeScolaireId,ecoleId}) 
      setInscription(data)
      
  }

  return (
    <div className="relative p-6">
      {inscription.map((inscrip) => <BulletinSecondaire key={inscrip.id} idStudent={inscrip.idStudent} classeId={classId} anneeScolaireId={anneeScolaireId} ecoleId={ecoleId} /> )}
      
    </div>
  );
}
