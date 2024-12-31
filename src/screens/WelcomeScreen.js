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
    <div class="container text-center">
      <div class="row">
        <div class="col-sm-8">
          <div class="card">
            <div class="card-body">
              <h3>Observações:</h3>
              <p>
                ✅ A prova deve ser feita individualmente, sem ajuda de
                terceiros.
              </p>
              <p>
                ✅ A prova terá apenas uma tentativa. Após iniciá-la, não será
                possível reiniciá-la ou fazer correções após o envio.
              </p>
              <p>
                ✅ Não saia da tela da prova. O sistema monitorará a navegação,
                e ao sair da tela, o acesso à prova será bloqueado
                automaticamente.
              </p>
              <p>
                ✅ Não é permitido consultar materiais impressos, digitais, uso
                de celulares ou quaisquer outros recursos de apoio durante a
                realização da prova.
              </p>
              <p>
                ✅ Em caso de problemas técnicos, o aluno deve informar
                imediatamente à professora responsável pela disciplina.
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
        <div className="input-field">
          <h1>Bem-vindo ao Sistema de Provas Online!</h1>
          <h2>Para iniciar a prova, preencha os campos abaixo:</h2>
          
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
