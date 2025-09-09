"use client";
import React, { useState, useEffect, Suspense } from "react";
import { BulletinService, BulletinResult } from "../../../services/bulletinService";

interface Props {
  classId: string;
  anneeScolaireId: string;
  ecoleId: string;
}

export default function BulletinLayout({ classId, anneeScolaireId, ecoleId }: Props) {
  const [bulletins, setBulletins] = useState<BulletinResult[]>([]);
  const [search, setSearch] = useState("");
  const [niveau, setNiveau] = useState<"primaire" | "secondaire">("secondaire");
  const [loading, setLoading] = useState(false);

  const loadBulletins = async () => {
    setLoading(true);
    try {
      const data = await BulletinService.getBulletins(
        classId,
        anneeScolaireId,
        ecoleId,
        niveau
      );
      setBulletins(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBulletins();
  }, [classId, anneeScolaireId, ecoleId, niveau]);

  const filtered = search
    ? bulletins.filter(
        (b) =>
          b.nomComplet.toLowerCase().includes(search.toLowerCase()) ||
          b.matricule.toLowerCase().includes(search.toLowerCase())
      )
    : bulletins;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Bulletins de la classe</h1>

      {/* Toggle Primaire / Secondaire */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setNiveau("primaire")}
          className={`px-4 py-2 rounded ${
            niveau === "primaire" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Primaire
        </button>
        <button
          onClick={() => setNiveau("secondaire")}
          className={`px-4 py-2 rounded ${
            niveau === "secondaire" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Secondaire
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher par nom ou matricule"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-2 py-1 mb-4 w-full rounded"
      />

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-3 text-blue-600 font-semibold">Calcul des bulletins...</span>
        </div>
      ) : (
        <Suspense fallback={<p>⏳ Chargement...</p>}>
          {filtered.map((b) => (
            <div
              key={b.studentId}
              className="border rounded-lg p-4 mb-6 shadow "
            >
              <h2 className="font-semibold">
                {b.nomComplet} ({b.matricule})
              </h2>
              <p>
                Pourcentage: {b.pourcentage.toFixed(2)} % | Rang: {b.rang}
              </p>
              <table className="w-full border mt-2 text-sm">
                <thead>
                  <tr className="">
                    <th className="border p-1">Cours</th>
                    <th className="border p-1">Périodes</th>
                    <th className="border p-1">Examens</th>
                    <th className="border p-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {b.notes.map((n, i) => (
                    <tr key={i}>
                      <td className="border p-1">{n.cour}</td>
                      <td className="border p-1">
                        {Object.entries(n.periodes).map(([p, v]) => (
                          <span key={p} className="mr-2">
                            {p}: {v}
                          </span>
                        ))}
                      </td>
                      <td className="border p-1">
                        {Object.entries(n.examens).map(([e, v]) => (
                          <span key={e} className="mr-2">
                            {e}: {v}
                          </span>
                        ))}
                      </td>
                      <td className="border p-1">{n.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </Suspense>
      )}
    </div>
  );
}
