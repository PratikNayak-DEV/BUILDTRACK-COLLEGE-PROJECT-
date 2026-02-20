import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import ErrorAlert from '../components/ErrorAlert';
import { setAuthSession } from '../context/auth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      setAuthSession(res.data.data.token, res.data.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded border bg-white p-5">
      <h2 className="mb-4 text-xl font-semibold">Login</h2>
      <ErrorAlert message={error} />
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded border p-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        <button className="w-full rounded bg-blue-600 px-4 py-2 text-white" type="submit">Login</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
    </div>
  );
}
