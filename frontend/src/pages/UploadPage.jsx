import { useState } from 'react';
import api from '../api/client';
import ErrorAlert from '../components/ErrorAlert';

const categories = ['Foundation', 'Superstructure', 'Facade', 'Interiors', 'Furnishing'];

export default function UploadPage() {
  const [form, setForm] = useState({ projectName: '', numberOfBuildings: 1, category: 'Foundation', image: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const projectRes = await api.post('/projects', {
        name: form.projectName,
        numberOfBuildings: Number(form.numberOfBuildings),
      });

      const projectId = projectRes.data.data._id;
      const ids = JSON.parse(localStorage.getItem('buildtrack_projects') || '[]');
      localStorage.setItem('buildtrack_projects', JSON.stringify(Array.from(new Set([...ids, projectId]))));

      const body = new FormData();
      body.append('projectId', projectId);
      body.append('category', form.category);
      body.append('image', form.image);

      await api.post('/upload-progress', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Upload completed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-2xl font-semibold">Upload Progress</h2>
      <ErrorAlert message={error} />
      {success && <p className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

      <form className="space-y-4 rounded border bg-white p-4" onSubmit={onSubmit}>
        <input name="projectName" placeholder="Project Name" className="w-full rounded border p-2" onChange={onChange} required />
        <input
          name="numberOfBuildings"
          type="number"
          min="1"
          className="w-full rounded border p-2"
          value={form.numberOfBuildings}
          onChange={onChange}
          required
        />
        <select name="category" className="w-full rounded border p-2" value={form.category} onChange={onChange}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input type="file" accept="image/*" className="w-full" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} required />
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="submit">Submit</button>
      </form>
    </div>
  );
}
