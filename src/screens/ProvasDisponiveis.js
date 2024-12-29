import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../css/ProvasDisponiveis.css';

const ProvasDisponiveis = ({ selecionarProva }) => {
  const [provas, setProvas] = useState([]);

  useEffect(() => {
    const fetchProvas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'provas'));
        const provasList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProvas(provasList);
      } catch (error) {
        console.error('Erro ao buscar provas:', error);
      }
    };

    fetchProvas();
  }, []);

  return (
    <div className="provas-disponiveis">
      <h2>Provas Disponíveis</h2>
      <div className="provas-lista">
        {provas.map((prova) => (
          <button
            key={prova.id}
            onClick={() => selecionarProva(prova)}
            className="prova-button"
          >
            {prova.titulo}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProvasDisponiveis;
