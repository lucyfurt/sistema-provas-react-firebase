import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../css/CadastrarCurso.css';

const CadastrarCurso = () => {
  const [nomeCurso, setNomeCurso] = useState('');

  const handleCadastrarCurso = async () => {
    if (!nomeCurso.trim()) {
      alert('Por favor, insira o nome do curso.');
      return;
    }
    try {
      await addDoc(collection(db, 'cursos'), {
        nome: nomeCurso.trim(),
      });
      alert('Curso cadastrado com sucesso!');
      setNomeCurso('');
    } catch (error) {
      console.error('Erro ao cadastrar curso:', error);
      alert('Erro ao cadastrar curso.');
    }
  };

  return (
    <div className="cadastrar-curso">
      <h2>Cadastrar Curso</h2>
      <input
        type="text"
        placeholder="Nome do Curso"
        value={nomeCurso}
        onChange={(e) => setNomeCurso(e.target.value)}
        className="curso-input"
      />
      <button onClick={handleCadastrarCurso} className="curso-button">
        Cadastrar Curso
      </button>
    </div>
  );
};

export default CadastrarCurso;
