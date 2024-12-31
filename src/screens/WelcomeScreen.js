import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../css/welcome.css";

const WelcomeScreen = ({ setAluno }) => {
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosSnapshot = await getDocs(collection(db, "cursos"));
        const cursosList = cursosSnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCursos(cursosList);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  const iniciarProva = () => {
    if (nome && curso) {
      setAluno({ nome, curso });
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="welcome-container">
      <h2>Sistema de Provas Online</h2>
      <input
        type="text"
        placeholder="Digite nome completo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="input-field"
      />
      <select
        value={curso}
        onChange={(e) => setCurso(e.target.value)}
        className="input-field"
      >
        <option value="">Selecione um curso</option>
        {cursos.map((curso) => (
          <option key={curso.id} value={curso.id}>
            {curso.nome}
          </option>
        ))}
      </select>
      <button onClick={iniciarProva} className="start-button">
        Iniciar Prova
      </button>
      <h3>Observações:</h3>
      <p>
        A prova terá apenas uma tentativa. Após iniciá-la, não será possível
        reiniciá-la ou fazer correções após o envio.
      </p>
      <p>
        Não saia da tela da prova. O sistema monitorará a navegação, e ao sair
        da tela, o acesso à prova será bloqueado automaticamente.
      </p>
      <p>
        Não é permitido consultar materiais impressos, digitais ou quaisquer
        outros recursos de apoio durante a realização da prova.
      </p>
      <p>
        O uso de celulares, relógios inteligentes ou quaisquer outros
        dispositivos eletrônicos é estritamente proibido durante a realização da
        prova.
      </p>
      <p>
        Em caso de problemas técnicos, o aluno deve informar imediatamente à
        professora, apresentando evidências (como capturas de tela ou mensagens
        de erro).
      </p>
    </div>
  );
};

export default WelcomeScreen;
