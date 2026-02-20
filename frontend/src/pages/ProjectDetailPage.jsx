import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import ErrorAlert from '../components/ErrorAlert';
import ProgressChart from '../components/ProgressChart';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [projectRes, historyRes] = await Promise.all([api.get(`/project/${id}`), api.get(`/project/${id}/history`)]);
        setProject(projectRes.data.data);
        setHistory(
          historyRes.data.data.history
            .slice()
            .reverse()
            .map((item) => ({
              ...item,
              uploadedAt: new Date(item.uploadedAt).toLocaleDateString(),
            }))
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project detail.');
      }
    })();
  }, [id]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Project Detail</h2>
      <ErrorAlert message={error} />
      {project && (
        <div className="mb-4 rounded border bg-white p-4">
          <h3 className="font-semibold text-slate-800">{project.name}</h3>
          <p className="text-sm text-slate-600">Number of Buildings: {project.numberOfBuildings}</p>
        </div>
      )}
      <ProgressChart data={history} />
    </div>
  );
}
