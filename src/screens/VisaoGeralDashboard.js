import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import MediaAlunosChart from '../components/MediaAlunosChart'; 
import '../css/VisaoGeralDashboard.css';

const VisaoGeralDashboard = () => {
  const [totalProvas, setTotalProvas] = useState(0);
  const [totalCursos, setTotalCursos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const provasSnapshot = await getDocs(collection(db, 'provas'));
        const cursosSnapshot = await getDocs(collection(db, 'resultados'));

        setTotalProvas(provasSnapshot.size); // Número de provas
        setTotalCursos(cursosSnapshot.size); // Número de cursos
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Carregando dados do dashboard...</div>;
  }

  return (
    <div className="dashboard-overview">
      <h2>Visão Geral do Dashboard</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Total de Provas</h3>
          <p>{totalProvas}</p>
        </div>
        <div className="card">
          <h3>Total de Cursos</h3>
          <p>{totalCursos}</p>
        </div>
    
      </div>
      <MediaAlunosChart/>
    </div>
    
  );
};

export default VisaoGeralDashboard;
