import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu, Hexagon } from 'lucide-react';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
            <Navbar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 md:ml-64 transition-all duration-300 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b border-white/5 bg-slate-900/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
                            <Hexagon className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg">CNG Portal</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" theme="dark" autoClose={3000} />
        </div>
    );
};

export default Layout;
