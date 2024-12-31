import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
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

  const provasFiltradas = filtroCurso
    ? provas.filter((prova) => prova.curso === filtroCurso)
    : provas;

  return (
    <div class="container px-4 text-center">
      <div class="row gx-5">
        <div class="col">
          <div class="p-3">
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
        <div class="col">
          <div class="p-3">
            {provasFiltradas.map((prova) => (
              <button
                key={prova.id}
                onClick={() => selecionarProva(prova)}
                className="prova-button"
              >
                {prova.titulo} ({prova.curso})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvasDisponiveis;
