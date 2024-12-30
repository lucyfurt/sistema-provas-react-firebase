import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import '../css/AddProvaScreen.css';

const AddProvaScreen = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [cursos, setCursos] = useState([]);
  const [questoes, setQuestoes] = useState([{ id: Date.now(), pergunta: '', opcoes: ['', '', '', ''], correta: '' }]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosSnapshot = await getDocs(collection(db, 'cursos'));
        const cursosList = cursosSnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCursos(cursosList);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        alert('Erro ao carregar os cursos.');
      }
    };

    fetchCursos();
  }, []);

  const handleAddQuestao = () => {
    setQuestoes([
      ...questoes,
      { id: Date.now(), pergunta: '', opcoes: ['', '', '', ''], correta: '' },
    ]);
  };

  const handleQuestaoChange = (id, field, value) => {
    setQuestoes(questoes.map((questao) => {
      if (questao.id === id) {
        if (field === 'pergunta') {
          return { ...questao, pergunta: value };
        } else if (field === 'correta') {
          return { ...questao, correta: value };
        } else {
          const novasOpcoes = [...questao.opcoes];
          novasOpcoes[field] = value;
          return { ...questao, opcoes: novasOpcoes };
        }
      }
      return questao;
    }));
  };

  const validarFormulario = () => {
    if (!titulo.trim()) return 'O título da prova é obrigatório.';
    if (!descricao.trim()) return 'A descrição da prova é obrigatória.';
    if (!disciplina.trim()) return 'A disciplina da prova é obrigatória.';
    if (!cursoSelecionado.trim()) return 'Por favor, selecione um curso.';

    for (const [index, questao] of questoes.entries()) {
      if (!questao.pergunta.trim()) return `A pergunta ${index + 1} está em branco.`;
      if (questao.opcoes.some((op) => !op.trim())) return `A pergunta ${index + 1} tem opções em branco.`;
      if (!questao.correta.trim()) return `A pergunta ${index + 1} não tem uma resposta correta.`;
      if (!questao.opcoes.includes(questao.correta)) return `A resposta correta da pergunta ${index + 1} deve estar entre as opções.`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarFormulario();
    if (erro) {
      alert(erro);
      return;
    }

    try {
      await addDoc(collection(db, 'provas'), {
        titulo,
        descricao,
        disciplina,
        curso: cursoSelecionado,
        questoes,
        timestamp: new Date(),
      });
      alert('Prova adicionada com sucesso!');
      setTitulo('');
      setDescricao('');
      setDisciplina('');
      setCursoSelecionado('');
      setQuestoes([{ id: Date.now(), pergunta: '', opcoes: ['', '', '', ''], correta: '' }]);
    } catch (error) {
      console.error('Erro ao adicionar a prova:', error);
      alert('Erro ao adicionar a prova. Tente novamente.');
    }
  };

  return (
    <div className="add-prova-screen">
      <h2>Adicionar Nova Prova</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título da Prova</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título da prova"
          />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva a prova"
          />
        </div>
        <div className="form-group">
          <label>Disciplina</label>
          <input
            type="text"
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            placeholder="Digite a disciplina"
          />
        </div>
        <div className="form-group">
          <label>Curso</label>
          <select
            value={cursoSelecionado}
            onChange={(e) => setCursoSelecionado(e.target.value)}
          >
            <option value="">Selecione um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.nome}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="questoes-container">
          {questoes.map((questao, index) => (
            <div key={questao.id} className="questao-item">
              <label>Pergunta {index + 1}</label>
              <input
                type="text"
                value={questao.pergunta}
                onChange={(e) => handleQuestaoChange(questao.id, 'pergunta', e.target.value)}
                placeholder="Digite a pergunta"
              />
              <div className="opcoes-container">
                {questao.opcoes.map((opcao, opcaoIndex) => (
                  <input
                    key={opcaoIndex}
                    type="text"
                    value={opcao}
                    onChange={(e) => handleQuestaoChange(questao.id, opcaoIndex, e.target.value)}
                    placeholder={`Opção ${opcaoIndex + 1}`}
                  />
                ))}
              </div>
              <label>Resposta Correta</label>
              <input
                type="text"
                value={questao.correta}
                onChange={(e) => handleQuestaoChange(questao.id, 'correta', e.target.value)}
                placeholder="Digite a resposta correta"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddQuestao} className="add-questao-button">
          + Adicionar Questão
        </button>
        <button type="submit" className="submit-button">
          Salvar Prova
        </button>
      </form>
    </div>
  );
};

export default AddProvaScreen;
