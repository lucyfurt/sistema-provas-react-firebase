import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import QuestionScreen from './screens/QuestionScreen';
import FinishScreen from './screens/FinishScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProvasDisponiveis from './screens/ProvasDisponiveis';

// Importa função para cálculo da nota
import calculaNota from './utils/calculaNota';

function App() {
  const [user, setUser] = useState(null);            
  const [aluno, setAluno] = useState({});              
  const [respostas, setRespostas] = useState([]);     
  const [nota, setNota] = useState(0);                
  const [isProfessor, setIsProfessor] = useState(false); 
  const [provas, setProvas] = useState([]); 
  const [provaSelecionada, setProvaSelecionada] = useState(null); 
  const [nomeProvaSelecionada, setNomeProvaSelecionada] = useState(""); 

  // Verifica se o usuário é professor ou aluno
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsProfessor(user.email === 'avaliacao99@gmail.com'); 
      } else {
        setUser(null);
        setIsProfessor(false);
      }
    });
    return unsubscribe;
  }, []);

  // Busca provas do Firestore
  useEffect(() => {
    const fetchProvas = async () => {
      try {
        const provasSnapshot = await getDocs(collection(db, 'provas'));
        const provasData = provasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProvas(provasData);
      } catch (error) {
        console.error("Erro ao buscar provas:", error);
      }
    };
    fetchProvas();
  }, []);

  // Função chamada ao finalizar a prova
  const handleProvaFinalizada = async (respostas) => {
    console.log("Prova finalizada com as respostas:", respostas);
    const pontos = calculaNota(provaSelecionada.questoes, respostas);
    setNota(pontos);
    setRespostas(respostas);

    // Salvar as respostas no Firestore
    try {
      await addDoc(collection(db, 'resultados'), {
        aluno: aluno.nome,
        curso: aluno.curso,
        prova: nomeProvaSelecionada,
        respostas,
        nota: pontos,
        timestamp: new Date(),
      });
      console.log("Respostas armazenadas com sucesso!");
    } catch (error) {
      console.error("Erro ao armazenar respostas:", error);
    }
  };

  // Alternância de provas pelo menu de seleção
  const selecionarProva = (prova) => {
    setProvaSelecionada(prova);
    setNomeProvaSelecionada(prova.titulo);
    setRespostas([]); 
    setNota(0);       
  };

  // Renderização condicional das telas
  if (!user) return <LoginScreen />;
  if (isProfessor) return <DashboardScreen />;
  if (!aluno.nome) return <WelcomeScreen setAluno={setAluno} />;
  if (!provaSelecionada) return <ProvasDisponiveis provas={provas} selecionarProva={selecionarProva} />;
  if (respostas.length === 0) {
    return (
      <QuestionScreen 
        questoes={provaSelecionada.questoes} 
        tempoMaximo={1800}  
        onProvaFinalizada={handleProvaFinalizada} 
      />
    );
  }

  return (
    <FinishScreen />
  );
}

export default App;
