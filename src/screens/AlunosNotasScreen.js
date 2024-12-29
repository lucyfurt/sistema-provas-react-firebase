import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../css/AlunosNotasScreen.css";

const AlunosNotasScreen = () => {
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [provas, setProvas] = useState([]);
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroProva, setFiltroProva] = useState("");

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "resultados"));
        const alunosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlunos(alunosList);

        // Extrair cursos e provas únicos
        const cursosUnicos = [
          ...new Set(alunosList.map((aluno) => aluno.curso)),
        ];
        const provasUnicas = [
          ...new Set(alunosList.map((aluno) => aluno.prova)),
        ];
        setCursos(cursosUnicos);
        setProvas(provasUnicas);
      } catch (error) {
        console.error("Erro ao buscar dados dos alunos:", error);
      }
    };

    fetchAlunos();
  }, []);

  // Filtrar os alunos com base nos filtros selecionados
  const alunosFiltrados = alunos.filter((aluno) => {
    return (
      (filtroCurso === "" || aluno.curso === filtroCurso) &&
      (filtroProva === "" || aluno.prova === filtroProva)
    );
  });

  // Função para excluir um registro
  const excluirAluno = async (id) => {
    try {
      await deleteDoc(doc(db, "resultados", id));
      setAlunos((prevAlunos) => prevAlunos.filter((aluno) => aluno.id !== id));
      alert("Registro excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
      alert("Erro ao excluir registro. Tente novamente.");
    }
  };

  return (
    <div className="alunos-notas">
      <h2>Dashboard Notas</h2>

      {/* Filtros */}
      <div className="filtros">
        <label>
          Curso:
          <select
            value={filtroCurso}
            onChange={(e) => setFiltroCurso(e.target.value)}
          >
            <option value="">Todos</option>
            {cursos.map((curso, index) => (
              <option key={index} value={curso}>
                {curso}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prova:
          <select
            value={filtroProva}
            onChange={(e) => setFiltroProva(e.target.value)}
          >
            <option value="">Todas</option>
            {provas.map((prova, index) => (
              <option key={index} value={prova}>
                {prova}
              </option>
            ))}
          </select>
    
        </label>
        <label>
                     {/* Botão para limpar filtros */}
      <button
        onClick={() => {
          setFiltroCurso('');
          setFiltroProva('');
        }}
        className="clear-filters"
      >
        Limpar Filtros
      </button>
        </label>
      
      </div>

      {/* Tabela de resultados */}
      {alunosFiltrados.length === 0 ? (
        <p>Nenhum aluno encontrado com os filtros aplicados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Curso</th>
              <th>Prova Escolhida</th>
              <th>Nota</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.aluno}</td>
                <td>{aluno.curso}</td>
                <td>{aluno.prova}</td>
                <td>{aluno.nota}</td>
                <td>
                  {new Date(aluno.timestamp.seconds * 1000).toLocaleString()}
                </td>
                <td>
                  <button
                    onClick={() => excluirAluno(aluno.id)}
                    className="delete-button"
                  >
                    Excluir
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

export default AlunosNotasScreen;
