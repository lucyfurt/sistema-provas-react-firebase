import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs} from "firebase/firestore";
import "../css/ProvasDisponiveis.css";

const ProvasDisponiveis = ({ selecionarProva }) => {
  const [provas, setProvas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [filtroCurso, setFiltroCurso] = useState("");

  useEffect(() => {
    const fetchProvas = async () => {
      const querySnapshot = await getDocs(collection(db, "provas"));
      const provasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProvas(provasList);
    };

    const fetchCursos = async () => {
      const querySnapshot = await getDocs(collection(db, "cursos"));
      const cursosList = querySnapshot.docs.map((doc) => doc.data().nome);
      setCursos(cursosList);
    };

    fetchProvas();
    fetchCursos();
  }, []);

  // Filtra provas pelo curso selecionado
  const provasFiltradas = filtroCurso
    ? provas.filter((prova) => prova.curso === filtroCurso)
    : provas;

  return (
    <div className="container px-4 text-center">
      <div className="row gx-5">
        <div className="col">
          <div className="p-3">
            <h2>Provas Disponíveis</h2>
            <select
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
              className="curso-select"
            >
              <option value="">Todos os Cursos</option>
              {cursos.map((curso, index) => (
                <option key={index} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col">
          <div className="p-3">
            {provasFiltradas.map((prova) => (
              <div key={prova.id} className="prova-item">
                <button
                  onClick={() => selecionarProva(prova)}
                  className="prova-button"
                  disabled={!prova.ativa} 
                >
                  {prova.titulo} ({prova.curso})
                </button>
                <span
                  className={`status ${prova.ativa ? "ativa" : "inativa"}`}
                >
                  {prova.ativa ? "Ativa" : "Inativa"}
                </span>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvasDisponiveis;
