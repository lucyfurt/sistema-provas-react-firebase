// src/WelcomeScreen.js
import React, { useState } from 'react';
import '../css/welcome.css';

const WelcomeScreen = ({ setAluno }) => {
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');

  const iniciarProva = () => {
    if (nome && curso) {
      setAluno({ nome, curso });
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="welcome-container">
      <h2>Sistema de provas do Curso Integrado em Informática</h2>
      <input 
        type="text" 
        placeholder="Digite nome completo" 
        value={nome} 
        onChange={(e) => setNome(e.target.value)} 
        className="input-field"
      />
      <input 
        type="text" 
        placeholder="Digite o curso: Informática/ANO" 
        value={curso} 
        onChange={(e) => setCurso(e.target.value)} 
        className="input-field"
      />
      <button onClick={iniciarProva} className="start-button">Iniciar Prova</button>
    </div>
  );
};

export default WelcomeScreen;
