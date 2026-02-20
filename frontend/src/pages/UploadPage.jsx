import { useEffect, useState } from 'react';
import api from '../api/client';
import ErrorAlert from '../components/ErrorAlert';

const categories = ['Foundation', 'Superstructure', 'Facade', 'Interiors', 'Furnishing'];

export default function UploadPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectMode: 'new',
    projectId: '',
    projectName: '',
    numberOfBuildings: 1,
    category: 'Foundation',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get('/projects');
        const data = response.data.data || [];
        setProjects(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, projectId: data[0]._id }));
        }
      } catch {
        // Non-blocking for upload form.
      }
    })();
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resolveProjectId = async () => {
    if (form.projectMode === 'existing') {
      if (!form.projectId) throw new Error('Please select an existing project.');
      return form.projectId;
    }

    const projectRes = await api.post('/projects', {
      name: form.projectName,
      numberOfBuildings: Number(form.numberOfBuildings),
    });

    return projectRes.data.data._id;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const projectId = await resolveProjectId();

      const body = new FormData();
      body.append('projectId', projectId);
      body.append('category', form.category);
      body.append('image', form.image);

      await api.post('/upload-progress', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Upload completed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed.');
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-2xl font-semibold">Upload Progress</h2>
      <ErrorAlert message={error} />
      {success && <p className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

      <form className="space-y-4 rounded border bg-white p-4" onSubmit={onSubmit}>
        <div className="flex gap-4">
          <label className="text-sm"><input type="radio" name="projectMode" value="new" checked={form.projectMode === 'new'} onChange={onChange} /> New</label>
          <label className="text-sm"><input type="radio" name="projectMode" value="existing" checked={form.projectMode === 'existing'} onChange={onChange} /> Existing</label>
        </div>

        {form.projectMode === 'new' ? (
          <>
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
          </>
        ) : (
          <select name="projectId" className="w-full rounded border p-2" value={form.projectId} onChange={onChange} required>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}

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
