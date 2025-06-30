import React, { useEffect, useState } from 'react';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
  cvUrl?: string;
  createdAt: string;
}

interface CandidateListProps {
  refresh: number;
}

const PAGE_SIZE = 5;

const CandidateList: React.FC<CandidateListProps> = ({ refresh }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCandidates = (page: number) => {
    setLoading(true);
    fetch(`/api/candidates?page=${page}&pageSize=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setCandidates(data.candidates);
        setTotal(data.total);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCandidates(page);
  }, [page, refresh]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) return <div>Cargando candidatos...</div>;

  return (
    <div>
      <h2>Lista de Candidatos</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>CV</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c.id}>
              <td>{c.firstName} {c.lastName}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                {c.cvUrl ? (
                  <a
                    href={c.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver CV
                  </a>
                ) : 'No adjunto'}
              </td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #1976d2', background: page === 1 ? '#eee' : '#1976d2', color: page === 1 ? '#888' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center' }}>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #1976d2', background: page === totalPages ? '#eee' : '#1976d2', color: page === totalPages ? '#888' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CandidateList;