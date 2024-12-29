import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AddProvaScreen from './AddProvaScreen';
import AlunosNotasScreen from './AlunosNotasScreen';
import VisaoGeralDashboard from './VisaoGeralDashboard';
import ProvasDashboard from './ProvasDashboard';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('overview');

  const renderContent = () => {
    switch (selectedMenu) {
      case 'addProva':
        return <AddProvaScreen />;
      case'listarProvas':
      return <ProvasDashboard />;
      case 'listarNotas':
        return <AlunosNotasScreen />;
      case 'overview':
        return <VisaoGeralDashboard/>
              default:
        return <div>Selecione uma opção no menu</div>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onMenuSelect={setSelectedMenu} />
      <div style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
