import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[22rem_1fr]">
        <Sidebar />
        <main className="space-y-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
