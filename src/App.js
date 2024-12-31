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
    
    // Cálculo da nota
    const pontos = calculaNota(provaSelecionada.questoes, respostas);
    setNota(pontos);
    setRespostas(respostas);
  
    // Verificar se o usuário já realizou a prova
    try {
      const resultadosRef = collection(db, 'resultados');
      const querySnapshot = await getDocs(resultadosRef);
      const resultados = querySnapshot.docs.map((doc) => doc.data());
  
      const jaRealizou = resultados.some(
        (resultado) => 
          resultado.email === user.email 
      );
  
      if (jaRealizou) {
        alert("Você já realizou essa prova!");
        return;
      }
  
      // Salvar as respostas no Firestore
      await addDoc(resultadosRef, {
        aluno: aluno.nome,
        curso: aluno.curso,
        prova: nomeProvaSelecionada,
        email: user.email, // Salva o e-mail do usuário
        respostas,
        nota: pontos,
        timestamp: new Date(),
      });
      console.log("Respostas armazenadas com sucesso!");
    } catch (error) {
      console.error("Erro ao armazenar respostas ou verificar a prova:", error);
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
