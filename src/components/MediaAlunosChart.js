import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../css/MediaAlunosChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MediaAlunosChart = () => {
  const [mediaPorProva, setMediaPorProva] = useState({});
  const [quantidadeAprovados, setQuantidadeAprovados] = useState(0);
  const [quantidadeSubstituicao, setQuantidadeSubstituicao] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respostasSnapshot = await getDocs(collection(db, 'respostas'));
        const respostas = respostasSnapshot.docs.map(doc => doc.data());
        console.log("Respostas recebidas:", respostas);

        const mediaTemp = {};
        let aprovados = 0;
        let substituicao = 0;

        respostas.forEach((resposta) => {
          const { prova, nota } = resposta;
          if (!mediaTemp[prova]) {
            mediaTemp[prova] = { soma: 0, quantidade: 0 };
          }

          mediaTemp[prova].soma += nota;
          mediaTemp[prova].quantidade += 1;

          if (nota >= 7) {
            aprovados += 1;
          } else {
            substituicao += 1;
          }

          console.log(`Prova: ${prova}, Nota: ${nota}, Aprovados: ${aprovados}, Substituição: ${substituicao}`);
        });

        const mediasCalculadas = Object.keys(mediaTemp).reduce((acc, prova) => {
          acc[prova] = (mediaTemp[prova].soma / mediaTemp[prova].quantidade).toFixed(2);
          return acc;
        }, {});

        setMediaPorProva(mediasCalculadas);
        setQuantidadeAprovados(aprovados);
        setQuantidadeSubstituicao(substituicao);

        console.log(`Aprovados: ${aprovados}, Substituição: ${substituicao}`);
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Carregando gráfico...</div>;
  }

  const data = {
    labels: Object.keys(mediaPorProva),
    datasets: [
      {
        label: 'Média de Notas',
        data: Object.values(mediaPorProva),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="media-alunos-chart">
      <h2>Média de Notas por Prova</h2>
      <Bar data={data} options={options} />
      
      <div className="status-alunos">
        <h3>Status dos Alunos</h3>
        <p>Alunos Aprovados: {quantidadeAprovados}</p>
        <p>Alunos em Substituição: {quantidadeSubstituicao}</p>
      </div>
    </div>
  );
};

export default MediaAlunosChart;
