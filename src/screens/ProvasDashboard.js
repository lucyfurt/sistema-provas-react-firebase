import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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

  // Deletar prova
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

  // Ativar/Desativar prova
  const handleToggleStatus = async (id, statusAtual) => {
    try {
      const provaRef = doc(db, 'provas', id);
      await updateDoc(provaRef, { ativa: !statusAtual });

      setProvas((prevProvas) =>
        prevProvas.map((prova) =>
          prova.id === id ? { ...prova, ativa: !statusAtual } : prova
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status da prova:', error);
      alert('Erro ao atualizar status.');
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
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {provas.map((prova) => (
              <tr key={prova.id}>
                <td>{prova.titulo}</td>
                <td>{prova.disciplina}</td>
                <td>{prova.descricao}</td>
                <td>
                  {prova.timestamp
                    ? new Date(prova.timestamp.seconds * 1000).toLocaleString()
                    : "Sem data"}
                </td>
                <td className={prova.ativa ? "status-ativa" : "status-inativa"}>
                  {prova.ativa ? "Ativa" : "Inativa"}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(prova.id, prova.ativa)}
                    className="toggle-status-button"
                  >
                    {prova.ativa ? "Desativar" : "Ativar"}
                  </button>
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
