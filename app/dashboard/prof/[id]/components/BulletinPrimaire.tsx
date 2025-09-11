import React from 'react'

function BulletinPrimaire() {
  return (
    <div className="p-6 ">
        
  <table className="table-auto border border-gray-400 w-full text-black">
  <thead className="bg-gray-200">
    <tr>
      <th colSpan={16} className="border border-gray-400 px-4 py-2 w-full">
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
      <td colSpan={16} className="border border-gray-400 px-4 py-2">
          <div>
                <span className="font-bold">N* ID : </span><span className="border px-2 py-0.5 m-0.5 border-b-black">7</span>
          </div>
      </td>
      
    </tr>
    <tr className="bg-white">
      <td colSpan={16} className="border border-gray-400 px-4 py-2">
          <div className="flex justify-between">
                <p><span className="font-bold">PROVINCE :</span> HAUT - KATANGA</p>
                <p><span className="font-bold">MATRICULE :</span> XXXXX-XXXXX</p>
          </div>
      </td>
    </tr>
    <tr className="bg-white">
      <td colSpan={8} className="border border-gray-400 px-4 py-2">
          <div>
                <p><span className="font-bold">VILLE :</span> LUBUMBASHI</p>
                <p><span className="font-bold">COMMUNE/TERRITOIRE :</span> LUBUMBASHI</p>
                <p><span className="font-bold">ECOLE :</span> C.S.SAINTE HELENE</p>
                <p><span className="font-bold">CODE :</span> <span className="border px-2 py-0.5 m-0.5 border-b-black">7</span></p>
          </div>
      </td>
      <td colSpan={8} className="border border-gray-400 px-4 py-2">
          <div>
                <p><span className="font-bold">ELEVE :</span> KAMAU MBATANGULI EMMANUEL</p>
                <p><span className="font-bold">Ne (e) a :</span> BENI Le 04/01/2006</p>
                <p><span className="font-bold">CLASSE :</span> 3eme HUMANITE LITTERAIRE</p>
                <p><span className="font-bold">N* PERM :</span> <span className="border px-2 py-0.5 m-0.5 border-b-black">7</span></p>
          </div>
      </td>
    </tr>
    <tr className="bg-white">
      <td colSpan={16} className="border border-gray-400 px-4 py-2">
          <div className="flex justify-center items-center">
                <p><span className="font-bold">BULLETIN DE LA 3eme ANNEE HUMANITES LATIN - PHILOSOPHIE ANNEE SCOLAIRE 2021 - 2022</span> </p>
                
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
      <td colSpan={4} className="border border-gray-400 px-4 py-2">
        <div className="flex justify-center items-center">
                <p><span className="font-bold">TROISIEME SEMESTRE</span> </p>
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
      <td className="border border-gray-400 px-4 py-2 font-bold">5ere P</td>
      <td className="border border-gray-400 px-4 py-2 font-bold">6eme P</td>
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

    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">MAXIMA</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td colSpan={2} className="border border-gray-400 px-4 py-2 bg-black"></td>
    </tr>

    <tr className="bg-gray-50 ">
      <td className="border border-gray-400 px-4 py-2 ">Religion</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
        <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2"></td>
    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">MAXIMA</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
     <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td colSpan={2} className="border border-gray-400 px-4 py-2 bg-black"></td>
    </tr>
    <tr className="bg-gray-50 ">
      <td className="border border-gray-400 px-4 py-2 ">Biologie</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
        <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2"></td>
    </tr>
    <tr className="bg-gray-50 font-bold">
      <td className="border border-gray-400 px-4 py-2">MAXIMA GENERAUX</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
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
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
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
      <td className="border border-gray-400 px-4 py-2">POURCENTAGE</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
      <td className="border border-gray-400 px-4 py-2">0</td>
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
        <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
      <td className="border border-gray-400 px-4 py-2"></td>
    </tr>
    <tr className="bg-gray-50 font-bold">
        <td colSpan={16} className="border border-gray-400 px-4 py-2">
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

export default BulletinPrimaire
