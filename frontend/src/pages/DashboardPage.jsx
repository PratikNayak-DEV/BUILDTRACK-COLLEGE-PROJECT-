import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ErrorAlert from '../components/ErrorAlert';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const ids = JSON.parse(localStorage.getItem('buildtrack_projects') || '[]');
        const responses = await Promise.all(ids.map((id) => api.get(`/project/${id}`)));
        setProjects(responses.map((r) => r.data.data));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Dashboard</h2>
      <ErrorAlert message={error} />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project._id} to={`/project/${project._id}`} className="rounded border bg-white p-4 hover:shadow">
            <h3 className="font-semibold text-slate-800">{project.name}</h3>
            <p className="text-sm text-slate-600">Buildings: {project.numberOfBuildings}</p>
            <p className="text-sm text-slate-600">Latest Progress: {project.latestProgress?.progressPercentage ?? 0}%</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
