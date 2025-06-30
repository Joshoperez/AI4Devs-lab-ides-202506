import React, { useState } from 'react';
import CandidateForm from '../components/CandidateForm';
import CandidateList from '../components/CandidateList';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleSuccess = () => {
    setShowForm(false);
    setRefreshList(prev => prev + 1); // Cambia el valor para forzar el refresco
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', padding: 20 }}>
      <header style={{
        background: '#1976d2', color: '#fff', padding: '1rem 2rem', borderRadius: 8, marginBottom: 30
      }}>
        <h1 style={{ margin: 0 }}>ATS - Dashboard de Reclutador</h1>
      </header>
      <main style={{
        maxWidth: 800, margin: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: '#1976d2', color: '#fff', border: 'none', padding: '10px 20px',
              borderRadius: 5, cursor: 'pointer', fontWeight: 600
            }}
          >
            {showForm ? 'Cerrar formulario' : 'Añadir Candidato'}
          </button>
        </div>
        {showForm && <CandidateForm onSuccess={handleSuccess} />}
        <CandidateList refresh={refreshList} />
      </main>
    </div>
  );
};

export default Dashboard;