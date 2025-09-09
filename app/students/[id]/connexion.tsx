"use client";

import { useState } from "react";
import { connecterEtudiant } from "../../services/studentsServices";
import { useRouter } from "next/navigation";


interface Props {
  AdminId: string;
}

export default function PageConnexionEtudiant({AdminId}:Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const routing = (route : string) => {
      router.push("/"+route)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await connecterEtudiant(email, motDePasse);
      setMessage("✅ Connexion réussie !");
      setLoading(true);
      localStorage.setItem('masomo_student', user.uid);
      routing('dashboard/students/'+AdminId)
    } catch (error: any) {
        setLoading(false);
      setMessage("❌ Erreur : " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Connexion Étudiant</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border p-2 rounded"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          disabled={loading}
        >
         
          {loading ? "⏳ En cours..." : " Se connecter"}
        </button>
      </form>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}
