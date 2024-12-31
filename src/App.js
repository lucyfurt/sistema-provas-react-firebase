import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import QuestionScreen from './screens/QuestionScreen';
import FinishScreen from './screens/FinishScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProvasDisponiveis from './screens/ProvasDisponiveis';
import ProvaRealizadaScreen from './screens/ProvaRealizadaScreen';

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

  useEffect(() => {
    const verificarProvasRealizadas = async () => {
      if (user) {
        try {
          const provasRealizadasSnapshot = await getDocs(collection(db, 'provas_realizadas'));
          const provasRealizadas = provasRealizadasSnapshot.docs
            .map((doc) => doc.data())
            .filter((prova) => prova.email === user.email);
  
          const jaRealizouProva = provasRealizadas.some(
            (prova) => prova.prova === nomeProvaSelecionada
          );
  
          if (jaRealizouProva) {
            setRespostas(["ALREADY_DONE"]); // Indicativo de que já realizou
          }
        } catch (error) {
          console.error("Erro ao verificar provas realizadas:", error);
        }
      }
    };
  
    verificarProvasRealizadas();
  }, [user, nomeProvaSelecionada]);

  
  // Função chamada ao finalizar a prova
  const handleProvaFinalizada = async (respostas) => {
    console.log("Prova finalizada com as respostas:", respostas);
    
    const pontos = calculaNota(provaSelecionada.questoes, respostas);
    setNota(pontos);
    setRespostas(respostas);
  
    try {
      // Salvar o resultado no Firestore
      await addDoc(collection(db, 'resultados'), {
        aluno: aluno.nome,
        curso: aluno.curso,
        prova: nomeProvaSelecionada,
        email: user.email,
        respostas,
        nota: pontos,
        timestamp: new Date(),
      });
  
      // Marcar a prova como realizada
      await addDoc(collection(db, 'provas_realizadas'), {
        email: user.email,
        prova: nomeProvaSelecionada,
      });
  
      console.log("Prova finalizada e marcada como realizada!");
    } catch (error) {
      console.error("Erro ao finalizar a prova:", error);
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
  if (respostas[0] === "ALREADY_DONE") return <ProvaRealizadaScreen />;
  
  return <FinishScreen />;
  
}

export default App;
