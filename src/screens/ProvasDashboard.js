import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import '../css/AlunosNotasScreen.css';

const ProvasDashboard = () => {
  const [provas, setProvas] = useState([]);

  useEffect(() => {
    const fetchProvas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'provas'));
        const provasList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProvas(provasList);
      } catch (error) {
        console.error('Erro ao buscar dados das provas:', error);
      }
    };

    fetchProvas();
  }, []);

  const handleDeleteProva = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar esta prova?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'provas', id));
      setProvas((prevProvas) => prevProvas.filter((prova) => prova.id !== id));
      alert('Prova deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar a prova:', error);
      alert('Erro ao deletar a prova. Tente novamente.');
    }
  };

  return (
    <div className="alunos-notas">
      <h2>Listar Provas</h2>
      {provas.length === 0 ? (
        <p>Nenhuma prova encontrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Disciplina</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {provas.map((prova) => (
              <tr key={prova.id}>
                <td>{prova.titulo}</td>
                <td>{prova.disciplina}</td>
                <td>{prova.descricao}</td>
                <td>{new Date(prova.timestamp.seconds * 1000).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteProva(prova.id)}
                    className="delete-button"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProvasDashboard;
