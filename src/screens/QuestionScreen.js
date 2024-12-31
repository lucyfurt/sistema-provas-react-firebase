import React, { useState, useEffect } from 'react';
import '../css/question.css';

const QuestionScreen = ({ questoes, tempoMaximo, onProvaFinalizada }) => {
  const [respostas, setRespostas] = useState({});
  const [tempoRestante, setTempoRestante] = useState(tempoMaximo);
  const [isProvaCancelada, setIsProvaCancelada] = useState(false);

  useEffect(() => {
    if (tempoRestante > 0 && !isProvaCancelada) {
      const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tempoRestante <= 0 || isProvaCancelada) {
      onProvaFinalizada(respostas);
    }
  }, [tempoRestante, onProvaFinalizada, respostas, isProvaCancelada]);

  const handleChange = (idQuestao, idOpcao) => {
    setRespostas({
      ...respostas,
      [idQuestao]: idOpcao,
    });
  };

  const finalizarProva = () => {
    onProvaFinalizada(respostas);
  };

  const formatarTempo = (tempo) => {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    return `${minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // A aba foi trocada ou a janela minimizada, cancelando a prova
        setIsProvaCancelada(true);
        alert('Você saiu da tela da prova. A prova foi cancelada.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="question-screen">
      <h2>Curso Integrado Técnico de Informática</h2>
      <div className="timer">Tempo restante: {formatarTempo(tempoRestante)}</div>

      {questoes.map((questao) => (
        <div key={questao.id} className="question">
          <h3>{questao.pergunta}</h3>
          <div className="options">
            {questao.opcoes.map((opcao, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name={`questao-${questao.id}`}
                  checked={respostas[questao.id] === opcao}
                  onChange={() => handleChange(questao.id, opcao)}
                />
                {opcao}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={finalizarProva} className="finish-button">
        Finalizar Prova
      </button>
    </div>
  );
};

export default QuestionScreen;
