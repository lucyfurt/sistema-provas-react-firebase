import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../css/CadastrarCurso.css";

const CadastrarCurso = () => {
  const [nomeCurso, setNomeCurso] = useState("");
  const [cursos, setCursos] = useState([]);

  // Função para buscar os cursos cadastrados no Firestore
  const fetchCursos = async () => {
    try {
      const cursosSnapshot = await getDocs(collection(db, "cursos"));
      const cursosList = cursosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCursos(cursosList);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  // Função para cadastrar um novo curso
  const handleCadastrarCurso = async () => {
    if (!nomeCurso.trim()) {
      alert("Por favor, insira o nome do curso.");
      return;
    }
    try {
      await addDoc(collection(db, "cursos"), {
        nome: nomeCurso.trim(),
      });
      alert("Curso cadastrado com sucesso!");
      setNomeCurso("");
      fetchCursos(); // Atualiza a lista de cursos após cadastrar
    } catch (error) {
      console.error("Erro ao cadastrar curso:", error);
      alert("Erro ao cadastrar curso.");
    }
  };

  // Função para deletar um curso
  const handleDeletarCurso = async (id) => {
    try {
      await deleteDoc(doc(db, "cursos", id));
      alert("Curso deletado com sucesso!");
      fetchCursos(); // Atualiza a lista de cursos após deletar
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
      alert("Erro ao deletar curso.");
    }
  };

  // UseEffect para buscar cursos ao carregar o componente
  useEffect(() => {
    fetchCursos();
  }, []);

  return (
    <div className="container overflow-hidden text-center">
      <div className="row gx-5">
        <div className="col">
          <div className="p-3">
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
        </div>
        <div className="col">
          <div className="p-3">
            <h3>Cursos Cadastrados</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nome do Curso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso) => (
                  <tr key={curso.id}>
                    <td>{curso.nome}</td>
                    <td>
                      <button
                        onClick={() => handleDeletarCurso(curso.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastrarCurso;
