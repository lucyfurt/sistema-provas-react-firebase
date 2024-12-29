const calculaNota = (questoes, respostas) => {
  let nota = 0;

  // Percorre todas as questões da prova
  questoes.forEach((questao) => {
    const respostaAluno = respostas[questao.id];  // Resposta do aluno para a questão
    
    // Verifica se a resposta do aluno corresponde à resposta correta
    if (respostaAluno && respostaAluno === questao.correta) {
      nota += 1;  // Incrementa 1 ponto por resposta correta
    }
  });

  return nota;  // Retorna a nota final
};

export default calculaNota;
