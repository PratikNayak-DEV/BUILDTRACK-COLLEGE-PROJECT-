import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();
  const navClass = (path) =>
    `px-3 py-2 rounded ${location.pathname === path ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`;

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <h1 className="text-xl font-bold text-slate-800">BuildTrack</h1>
          <nav className="flex gap-2">
            <Link to="/" className={navClass('/')}>Dashboard</Link>
            <Link to="/upload" className={navClass('/upload')}>Upload</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
