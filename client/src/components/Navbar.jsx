import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Home, PlusCircle, History, LogOut, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ isOpen, onClose }) => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-primary-500/10 text-primary-400 border-r-2 border-primary-500' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200';
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <nav className={`w-64 bg-slate-900 border-r border-white/5 min-h-screen fixed left-0 top-0 flex flex-col z-50 backdrop-blur-3xl transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 border-b border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg shadow-lg ring-2 ring-primary-500/20">
                            <Hexagon className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-wide">CNG Portal</h1>
                    </div>
                    {/* Close button for mobile inside drawer */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <LogOut className="w-5 h-5 rotate-180" /> {/* Reusing LogOut icon as back arrowish or just X */}
                    </button>
                </div>

                <div className="flex-1 py-8 flex flex-col gap-2 px-4">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Menu</p>
                    <Link to="/" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/')}`}>
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/add" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/add')}`}>
                        <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">New Entry</span>
                    </Link>
                    <Link to="/history" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/history')}`}>
                        <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">History</span>
                    </Link>
                </div>

                <div className="p-4 border-t border-white/5 mx-4 mb-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/10"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
